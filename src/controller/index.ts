import { Request, Response, NextFunction } from "express";
import autoBind from "../libraries/autobind";
import HttpResponse from "../views/httpResponse";

interface HttpHandlerResult {
  status?: number;
  message?: string;
  container?: any;
  headers?: any;
  file?: any;
  text?: any;
  currentPage?: number;
  totalPages?: number;
}

abstract class HttpController {
  constructor() {
    autoBind(this);
  }

  public abstract handler(req: Request): Promise<HttpHandlerResult>;

  public async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.handler(req);

      if (result.headers) {
        res.writeHead(result.status ? result.status : 200, result.headers);
      }

      const httpResponse = new HttpResponse({
        status: result.status,
        message: result.message,
        container: result.container,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      });

      res.status(httpResponse.getStatus()).json(httpResponse.toJSON());
    } catch (error) {
      next(error);
    }
  }
}

export default HttpController;
export { HttpHandlerResult };
