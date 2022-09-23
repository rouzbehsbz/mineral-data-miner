import { Request } from "express";
import HttpController, { HttpHandlerResult } from "..";
import WebCrawlerService from "../../services/webCrawlerService";

class GetMineralsController extends HttpController {
  public async handler(req: Request): Promise<HttpHandlerResult> {
    const mineralsList = await WebCrawlerService.getMineralNamesAndURLsList();

    const mappedMineralsNames = mineralsList.map((mineral) => {
      return mineral.name;
    });

    return {
      container: mappedMineralsNames,
    };
  }
}

export default GetMineralsController;
