import { NextFunction, Request, Response } from "express";
import HttpError from "../errors/httpError";

class ErrorHandlerMiddleware {
  public async handle(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (process.env.DEBUG_MODE === "true") {
      console.log(err);
    }

    if (!(err instanceof HttpError)) {
      err = new HttpError("Oops ! Something went wrong.");
    }

    res.status(err.getStatus()).json(err);
  }
}

export default ErrorHandlerMiddleware;
