import { ISubscriptionController } from "@modules/subscription/dto/subscription.dto";
import { Request, Response } from "express";

export class subscriptionController implements ISubscriptionController {
  create(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    throw new Error("Method not implemented.");
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
