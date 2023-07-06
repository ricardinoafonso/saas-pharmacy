import { Router } from "express";
import { limitController } from "../http/controller/limit.controller";
const limitRouter = Router();
const LimitController = new limitController();
limitRouter.post("/create", LimitController.create);
limitRouter.put("/update/:id", LimitController.update);
limitRouter.get("/", LimitController.findAll);
limitRouter.get("/:id", LimitController.findOne);

export default limitRouter;