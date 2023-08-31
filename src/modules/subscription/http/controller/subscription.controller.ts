import {
  ISubscriptionController,
  ISubscriptions,
} from "@modules/subscription/dto/subscription.dto";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { subscriptionService } from "@modules/subscription/service/subscription.service";

export class subscriptionController implements ISubscriptionController {
  async create(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const data = req.body as ISubscriptions;
    const containerSubscription = container.resolve(subscriptionService);
    const result = await containerSubscription.create(data);
    return res.status(201).json(result);
  }
  disabled(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    throw new Error("Method not implemented.");
  }
  delete(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    throw new Error("Method not implemented.");
  }
  update(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    throw new Error("Method not implemented.");
  }
}
