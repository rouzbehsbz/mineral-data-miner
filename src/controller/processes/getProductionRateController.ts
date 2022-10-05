import { Request } from "express";
import HttpController, { HttpHandlerResult } from "..";
import HttpError from "../../errors/httpError";
import ExcelService from "../../services/excelService";
import WebCrawlerService from "../../services/webCrawlerService";

class GetProductionRateController extends HttpController {
  public async handler(req: Request): Promise<HttpHandlerResult> {
    const { country, mineral } = req.query;

    let result: {
      year: number;
      country: number;
      world: number;
    }[] = [];

    const mineralsList = await WebCrawlerService.getMineralNamesAndURLsList();
    const findMinerl = mineralsList.find(
      (mineralDetail) => mineralDetail.name === (mineral as string)
    );

    if (!findMinerl) {
      throw new HttpError("Can't find this mineral.");
    }

    const findMineralExcelLinks =
      await WebCrawlerService.getAvailableMineralExcelLinks(findMinerl.url);

    let pendingDownloads = [];

    for (const excelLinks of findMineralExcelLinks) {
      if (excelLinks.url) {
        const excelData = WebCrawlerService.getExcelFileFromURL(excelLinks.url);

        pendingDownloads.push(excelData);
      }
    }

    const fulfilledDownlods = await Promise.allSettled(pendingDownloads);

    for (const fulfilledDownlod of fulfilledDownlods) {
      if (fulfilledDownlod.status === "fulfilled") {
        const excel = new ExcelService(Buffer.from(fulfilledDownlod.value));
        const extractSheets = excel.getWorldProductionSpecifiedSheetNames();

        for (const sheet of extractSheets) {
          const data = excel.getProductionDataOfSpecificSheetByCountry(
            sheet,
            country as string
          );

          for (const infoDetail of data.info) {
            const findDuplicateYearIndex = result.findIndex(
              (resultDetail) => resultDetail.year === infoDetail.year
            );

            if (findDuplicateYearIndex === -1) {
              result.push({
                year: infoDetail.year,
                country: infoDetail.country,
                world: infoDetail.world,
              });
            } else if (
              result[findDuplicateYearIndex].country < infoDetail.country ||
              result[findDuplicateYearIndex].world < infoDetail.world
            ) {
              result[findDuplicateYearIndex] = {
                year: infoDetail.year,
                country: infoDetail.country,
                world: infoDetail.world,
              };
            }
          }
        }
      }
    }

    return {
      container: result,
    };
  }
}

export default GetProductionRateController;
