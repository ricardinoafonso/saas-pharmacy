import "reflect-metadata";
import "dotenv/config";
import "express-async-errors"
import Express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "@shared/infra/container/index";

import Logger from "@config/logger";
import { BaseError } from "@errors/Base";
import LoadRoutes from "../routes/routes.routes";

const App = Express();

App.use(cors({
  origin: '*'
}))

App.use(Express.urlencoded({ extended: true }));
App.use(Express.json());

LoadRoutes(App)

App.use((_err: Error, req: Request, res: Response, next: NextFunction) => {
  if(res.get("env") != 'production'){
    Logger.error(_err)
  }
  if (_err instanceof BaseError) {
    return res.status(_err.statusCode!).json({
      message: _err.message,
      key: _err.key,
      errorLocationCode: _err.errorLocationCode,
      action: _err.action,
      stack: "",
      status: _err.statusCode,
    });
  }
  return res
    .status(500)
    .json({ message: "Internal server Error ", status: 500, error: _err.message });
});


export  {App};
