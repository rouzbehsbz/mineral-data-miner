import { Router } from "express";
import GetMineralsController from "../../../../controller/minerals/getMineralsListController";
import GetProductionRateController from "../../../../controller/processes/getProductionRateController";

const processesRouter = Router();

processesRouter.get(
  "/production-rates",
  new GetProductionRateController().handle
);

export default processesRouter;
