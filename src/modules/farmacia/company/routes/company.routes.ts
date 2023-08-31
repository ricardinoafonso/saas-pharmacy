import { Router } from "express";
import { companyController } from "../http/company.controller";
import { Authorization } from '@shared/authorization';
import { container } from "tsyringe";

const companyRouter = Router();
const CompanyController = new companyController();

const authorization = container.resolve(Authorization)

companyRouter.use(authorization.is(['superuser','admin','user:all','custom:user:all']))

companyRouter.get('/', CompanyController.findAll)
companyRouter.get("/:id",CompanyController.findOne)
companyRouter.get('/user/:id',CompanyController.findUserId)
companyRouter.post("/create", CompanyController.create);

companyRouter.put('/update/:id/:userId', CompanyController.update)
companyRouter.put('/update/:id', CompanyController.update)
companyRouter.delete('/delete/user', CompanyController.delete);

export default companyRouter;
