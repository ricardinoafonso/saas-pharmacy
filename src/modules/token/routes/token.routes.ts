import { Router } from "express";
import { TokenController } from "../http/controller/token.controller";
const refreshRouter = Router();
const tokenController = new TokenController();
refreshRouter.post("/create", tokenController.execute);
refreshRouter.patch("/refresh", tokenController.refresh_token);
export default refreshRouter;
