import { Router } from "express";
import GetProductionRatesRanksController from "../../../../controller/ranks/getProductionRatesRanksController";

const ranksRouter = Router();

ranksRouter.get(
  "/production-rates",
  new GetProductionRatesRanksController().handle
);

export default ranksRouter;
