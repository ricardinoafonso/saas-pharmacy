import keyRouter from "@modules/Keys/routes/kyes.routes";
import companyRouter from "@modules/company/routes/company.routes";
import limitRouter from "@modules/limit/routes/limit.routes";
import plansRouter from "@modules/plans/routes/plans.routes";
import UserRoute from "@modules/Users/routes/user.routes";
import SwaggerUI from "swagger-ui-express";
import docs from "./../../../swagger.json";

const LoadRoutes = (app: any) => {
  app.use("/api-docs", SwaggerUI.serve, SwaggerUI.setup(docs));
  app.use("/api/v1/user", UserRoute);
  app.use("/api/v1/company", companyRouter);
  app.use("/api/v1/key", keyRouter);
  app.use("/api/v1/plans", plansRouter);
  app.use("/api/v1/limit", limitRouter);
};

export default LoadRoutes;
