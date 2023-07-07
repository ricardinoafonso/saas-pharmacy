import { Router } from "express";
import { companyController } from "../http/company.controller";
const companyRouter = Router();
const CompanyController = new companyController();

companyRouter.get('/', CompanyController.findAll)
companyRouter.get('/user/:id',CompanyController.findUserId)
companyRouter.post("/create", CompanyController.create);

companyRouter.put('/update/:id/:userId', CompanyController.update)
companyRouter.put('/update/:id', CompanyController.update)
companyRouter.delete('/delete/user', CompanyController.delete);

export default companyRouter;
