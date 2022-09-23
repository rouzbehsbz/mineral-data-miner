import { Request } from "express";
import HttpController, { HttpHandlerResult } from "..";
import WebCrawlerService from "../../services/webCrawlerService";

class GetCountriesListController extends HttpController {
  public async handler(req: Request): Promise<HttpHandlerResult> {
    const countriesList = await WebCrawlerService.getCountryNamesList();

    return {
      container: countriesList,
    };
  }
}

export default GetCountriesListController;
