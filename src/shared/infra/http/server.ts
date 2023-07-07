import "reflect-metadata";
import "dotenv/config";
import Express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import "@shared/infra/container/index";
import { BaseError } from "@errors/Base";
import LoadRoutes from "../routes/routes.routes";
import { LoadMiddleware } from "../middleware";
const App = Express();

LoadMiddleware(App);
LoadRoutes(App);

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
