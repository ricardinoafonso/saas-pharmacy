import { Router } from "express";
import { CategoriesController } from "../http/controller/categories.controller";
const CategoriesRouter = Router();
const categoriesController = new CategoriesController()
CategoriesRouter.post('/', categoriesController.create)
CategoriesRouter.patch('/', categoriesController.update)
CategoriesRouter.get('/:id', categoriesController.findOne)
CategoriesRouter.get('/', categoriesController.findAll)
CategoriesRouter.delete('/:id', categoriesController.create)

export default CategoriesRouter;
