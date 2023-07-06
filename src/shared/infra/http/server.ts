import "reflect-metadata";
import "dotenv/config";
import Express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import "@shared/infra/container/index";
import UserRoute from "@modules/Users/routes/user.routes";
import cors from "cors";
import { BaseError } from "@errors/Base";
import companyRouter from "@modules/company/routes/company.routes";
import SwaggerUI from "swagger-ui-express";
import docs from "./../../../swagger.json";
import keyRouter from "@modules/Keys/routes/kyes.routes";
import plansRouter from "@modules/plans/routes/plans.routes";
import limitRouter from "@modules/limit/routes/limit.routes";
const App = Express();

App.use(
  cors({
    origin: true,
  })
);
App.use(Express.urlencoded({ extended: true }));
App.use(Express.json());

App.use("/api-docs", SwaggerUI.serve, SwaggerUI.setup(docs));
App.use("/api/v1/user", UserRoute);
App.use("/api/v1/company", companyRouter);
App.use("/api/v1/key", keyRouter);
App.use("/api/v1/plans", plansRouter);
App.use("/api/v1/limit", limitRouter);

App.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof BaseError) {
    return res.status(error.statusCode).json({
      message: error.message,
      key: error.key,
      errorLocationCode: error.errorLocationCode,
      action: error.action,
      stack: error.stack,
      status: error.statusCode,
    });
  }

  return res
    .status(500)
    .json({ message: "Internal server Error", status: 500 });
});

export default App;
