import { Router } from "express";
import { productController } from "../http/controller/product.controller";
import { Authorization } from "@shared/authorization";
import { container } from "tsyringe";

class ProductRouter {
  private productRouter: Router;
  private authorization: Authorization;
  private ProductController: productController;
  constructor() {
    this.productRouter = Router();
    this.ProductController = new productController();
    this.authorization = container.resolve(Authorization);
  }
  get productRouters(): Router {
    this.productRouter.get("/:id/:company", this.ProductController.findOne);
    this.productRouter.get("/:id", this.ProductController.findAll);
    this.productRouter.use(
      this.authorization.is([
        "superuser",
        "admin",
        "product:create",
        "product:update",
      ])
    );
    this.productRouter.post("/create", this.ProductController.create);
    this.productRouter.patch("/", this.ProductController.update);
    this.productRouter.delete('/', this.ProductController.delete)
    return this.productRouter;
  }
}

//const AuthorizationContainer = container.resolve(Authorization);

export default new ProductRouter().productRouters;
