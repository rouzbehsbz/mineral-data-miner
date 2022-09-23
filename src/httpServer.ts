import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import path from "path";
import * as SwaggerUI from "swagger-ui-express";
import swaggerDocuments from "./docs/swaggerDocuments.json";
import router from "./routes";
import { config as dotEnvConfig } from "dotenv";
import ErrorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";
import EndpointNotFoundMiddleware from "./middlewares/endpointNotFoundMiddleware";

dotEnvConfig();

declare global {
  namespace Express {
    interface Request {
      swaggerDoc: { [key: string]: any };
    }
  }
}

class HttpServer {
  public applicationPort = process.env.APP_PORT ? +process.env.APP_PORT : 3000;
  public applicationHost = process.env.APP_HOST
    ? process.env.APP_HOST
    : "localhost";
  public applicationProtocol = process.env.APP_PROTOCOL
    ? process.env.APP_PROTOCOL
    : "http";

  private app = express();
  private httpServer!: http.Server;

  constructor() {
    this.setupHTTPServer();
    this.initiateExpressConfigurations();
    this.initiateRoutes();
  }

  private setupHTTPServer() {
    this.httpServer = http
      .createServer({}, this.app)
      .listen(this.applicationPort, "0.0.0.0", () => {
        console.log(
          `Listening on ${this.applicationProtocol}://${this.applicationHost}:${this.applicationPort}...`
        );
      });
  }

  private initiateExpressConfigurations() {
    this.app.enable("trust proxy");
    this.app.use(cors({ origin: "*" }));
    this.app.use("/", express.static(path.resolve("./public")));
    this.app.use(express.json({ limit: "5mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "5mb" }));
    this.app.disable("etag");
    this.app.disable("x-powered-by");
  }

  private initiateRoutes() {
    this.app.use(
      "/docs",
      (req: Request, _: Response, next: NextFunction) => {
        swaggerDocuments.host = `${this.applicationHost}:${this.applicationPort}`;
        swaggerDocuments.schemes = [this.applicationProtocol.toUpperCase()];
        req["swaggerDoc"] = swaggerDocuments;
        next();
      },
      SwaggerUI.serve,
      SwaggerUI.setup()
    );
    this.app.use("/", router);
    this.app.use(new EndpointNotFoundMiddleware().handle);
    this.app.use(new ErrorHandlerMiddleware().handle);
  }
}

export default HttpServer;
