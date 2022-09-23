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

    for (const excelLinks of findMineralExcelLinks) {
      if (excelLinks.url) {
        try {
          const excelData = await WebCrawlerService.getExcelFileFromURL(
            excelLinks.url
          );

          const excel = new ExcelService(Buffer.from(excelData));
          const extractSheets = excel.getWorldProductionSpecifiedSheetNames();

          for (const sheet of extractSheets) {
            const data = excel.getProductionDataOfSpecificSheetByCountry(
              sheet,
              country as string
            );

            for (const infoDetail of data.info) {
              const findDuplicateYear = result.find(
                (resultDetail) => resultDetail.year === infoDetail.year
              );

              if (!findDuplicateYear) {
                result.push({
                  year: infoDetail.year,
                  country: infoDetail.country,
                  world: infoDetail.world,
                });
              }
            }
          }
        } catch (err) {
          continue;
        }
      }
    }

    return {
      container: result,
    };
  }
}

export default GetProductionRateController;
