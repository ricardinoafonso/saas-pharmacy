import { Router } from "express";
import { subscriptionController } from "../http/controller/subscription.controller";
import { container } from 'tsyringe';
import { Authorization } from "@shared/authorization";
const SubscriptionRouter = Router()
const SubscriptionController = new  subscriptionController()
const AuthorizationContainer = container.resolve(Authorization)
SubscriptionRouter.use(AuthorizationContainer.is)
SubscriptionRouter.post('/create', SubscriptionController.create)
SubscriptionRouter.put('/', SubscriptionController.update)
SubscriptionRouter.delete('/', SubscriptionController.delete)
SubscriptionRouter.post('/desabled', SubscriptionController.disabled)

export default SubscriptionRouter