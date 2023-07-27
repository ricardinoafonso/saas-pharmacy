import { Router } from "express";
import { salesController } from "../http/controller/sales.controller";
const salesRouter = Router();
const SalesController = new salesController();
salesRouter.post('/create', SalesController.create)
export default salesRouter