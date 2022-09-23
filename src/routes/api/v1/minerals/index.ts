import { Router } from "express";
import GetMineralsController from "../../../../controller/minerals/getMineralsListController";

const mineralsRouter = Router();

mineralsRouter.get("/", new GetMineralsController().handle);

export default mineralsRouter;
