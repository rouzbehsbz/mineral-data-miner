import { Router } from "express";
import countriesRoutes from "./countries";
import mineralsRouter from "./minerals";
import processesRouter from "./processes";

const v1Router = Router();

v1Router.use("/countries", countriesRoutes);
v1Router.use("/minerals", mineralsRouter);
v1Router.use("/processes", processesRouter);

export default v1Router;
