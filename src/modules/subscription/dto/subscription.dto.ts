import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export interface ISubscription {
  create(data: ISubscriptions): Promise<ISubscriptions>;
  disabled(id: number, type: boolean): Promise<ISubscriptions>;
  delete(id: number): Promise<void>;
  update(
    id: number,
    data: ISubscriptions
  ): Promise<Prisma.subscriptionCreateManyInput>;
  findOne(where: Prisma.subscriptionWhereInput): Promise<ISubscriptions>;
}
export interface ISubscriptionController {
  create(req: Request, res: Response): Promise<Response>;
  disabled(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
}

export interface ISubscriptions {
  id?: number;
  plansId?: number;
  userId?: number;
  startDate?: Date;
  endDate?: Date;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
