import { Router } from "express";
import { subscriptionController } from "../http/controller/subscription.controller";
const SubscriptionRouter = Router()
const SubscriptionController = new  subscriptionController()

SubscriptionRouter.post('/create', SubscriptionController.create)
SubscriptionRouter.put('/', SubscriptionController.update)
SubscriptionRouter.delete('/', SubscriptionController.delete)
SubscriptionRouter.post('/desabled', SubscriptionController.disabled)

export default SubscriptionRouter