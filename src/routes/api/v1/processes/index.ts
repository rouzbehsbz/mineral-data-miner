import { Router } from "express";
import GetProductionRateController from "../../../../controller/processes/getProductionRateController";

const processesRouter = Router();

processesRouter.get(
  "/production-rates",
  new GetProductionRateController().handle
);

export default processesRouter;
