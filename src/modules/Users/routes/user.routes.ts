import { Router } from "express";
import { UserController } from "../http/controller/user.controler";
import { Authorization } from "@shared/authorization";
import { container } from "tsyringe";
const userRoute = Router();
const userController = new UserController();
const AuthorizationContainer = container.resolve(Authorization);

//userRoute.use(AuthorizationContainer.is(["admin", "superuser"]))
userRoute.get("/",userController.findAll);
userRoute.get("/filtered-user/", userController.filteredUser);
userRoute.get("/:id", userController.findOne);
userRoute.get("/username/:username", userController.findUsername);
userRoute.post("/create", userController.create);
userRoute.put("/status/:id/:status", userController.statusUpdate);
userRoute.post("/features/add/", userController.addFeatures);
userRoute.post("/features/remove/", userController.removeFeatures);
export default userRoute;
