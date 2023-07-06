import { Router } from "express";
import { plansController } from "../http/controller/plans.controller";

const plansRouter = Router();
const PlansController = new plansController();
plansRouter.post("/create", PlansController.create);
plansRouter.put("/update/:id", PlansController.update);
plansRouter.get("/", PlansController.findAll);
plansRouter.get("/:id", PlansController.findOne);

export default plansRouter;
