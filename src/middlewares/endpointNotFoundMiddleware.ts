import { NextFunction, Request, Response } from "express";
import HttpError from "../errors/httpError";

class EndpointNotFoundMiddleware {
  public async handle(req: Request, res: Response, next: NextFunction) {
    try {
      throw new HttpError("Sorry, your requested endpoint not found.");
    } catch (err) {
      next(err);
    }
  }
}

export default EndpointNotFoundMiddleware;
