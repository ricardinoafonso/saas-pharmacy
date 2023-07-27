import { Router } from "express";
import { productController } from '../http/controller/product.controller';
const productRouter = Router()
const ProductController = new productController()
productRouter.post('/create', ProductController.create)
productRouter.get('/:id/:company', ProductController.findOne)
productRouter.patch('/', ProductController.update)
productRouter.get('/:id', ProductController.findAll)
export default productRouter