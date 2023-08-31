import { Router } from "express";
import { salesController } from "../http/controller/sales.controller";
import { Authorization } from "@shared/authorization";
import { container } from "tsyringe";
const salesRouter = Router();
const Controller = new salesController();

const authorization = container.resolve(Authorization);

salesRouter.use(authorization.is(["sales:create"]));
salesRouter.get("/all", Controller.findAll);
salesRouter.get("/:id", Controller.findOne);

salesRouter.use(authorization.is(["sales:create"]));
salesRouter.post("/create", Controller.create);

salesRouter.use(
  authorization.is(["admin", "superuser", "sales:delete", "sales:update"])
);

salesRouter.patch("/", Controller.update);
salesRouter.delete("/:companyId/:id", Controller.delete);
export default salesRouter;
