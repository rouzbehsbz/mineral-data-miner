import { Router } from "express";
import GetCountriesListController from "../../../../controller/countries/getCountriesListController";

const countriesRoutes = Router();

countriesRoutes.get("/", new GetCountriesListController().handle);

export default countriesRoutes;
