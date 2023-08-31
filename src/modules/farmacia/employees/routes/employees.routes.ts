import { Router } from "express";
import { EmployeesController } from "../http/controller/employees.controller";
import { container } from "tsyringe";
import { Authorization } from "@shared/authorization";

const AuthorizationContainer = container.resolve(Authorization);

const employeesRouter = Router();
const controller = new EmployeesController();

employeesRouter.post("/auth", controller.login);

employeesRouter.use(
  AuthorizationContainer.is([
    "superuser",
    "admin",
    "user:all",
    "custom:user:all",
  ])
);
employeesRouter.post("/create", controller.create);
employeesRouter.get("/employee", controller.findOne);
employeesRouter.delete('/', controller.delete)
export { employeesRouter };
