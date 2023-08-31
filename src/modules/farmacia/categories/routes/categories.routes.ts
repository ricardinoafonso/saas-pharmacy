import { Router } from "express";
import { CategoriesController } from "../http/controller/categories.controller";
import { container } from "tsyringe";
import { Authorization } from "@shared/authorization";
const CategoriesRouter = Router();

const categoriesController = new CategoriesController()
const AuthorizationContainer = container.resolve(Authorization)

CategoriesRouter.use(AuthorizationContainer.is())
CategoriesRouter.get('/:id', categoriesController.findOne)
CategoriesRouter.get('/', categoriesController.findAll)

CategoriesRouter.use(AuthorizationContainer.is(['admin', 'superuser','user']))

CategoriesRouter.post('/', categoriesController.create)
CategoriesRouter.patch('/', categoriesController.update)
CategoriesRouter.delete('/:id', categoriesController.delete)

export default CategoriesRouter;
