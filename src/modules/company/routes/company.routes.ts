import { Router } from "express";
import { companyController } from "../http/company.controller";
const companyRouter = Router();
const companyContainer = new companyController();

companyRouter.get('/', companyContainer.findAll)
companyRouter.get('/user/:id',companyContainer.findUserId)
companyRouter.post("/create", companyContainer.create);

companyRouter.put('/update/:id/:userId', companyContainer.update)
companyRouter.delete('/delete/user', companyContainer.delete);

export default companyRouter;
