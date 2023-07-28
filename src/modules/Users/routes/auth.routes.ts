import { Authcontroller } from "../http/controller/auth.controller";
import { Router } from "express";
const authRoute = Router();

const controller = new Authcontroller();
authRoute.post("/signup", controller.create);
authRoute.post("/", controller.execute);

export default authRoute;
