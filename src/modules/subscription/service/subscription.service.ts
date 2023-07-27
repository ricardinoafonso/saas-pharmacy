import { Prisma, PrismaClient } from "@prisma/client";
import { ISubscription, ISubscriptions } from "../dto/subscription.dto";
import { inject, injectable } from "tsyringe";
import { prisma } from "@shared/infra/database/database";
import { User } from "@modules/Users/dto/services.dto";
import { BaseError } from "@errors/Base";
import { PlansService } from "@modules/plans/service/plans.service";

@injectable()
export class subscriptionService implements ISubscription {
  private ISubscriptionRepository: PrismaClient;
  constructor(
    @inject("userService") private userService: User,
    @inject("plansService") private plansService: PlansService
  ) {
    this.ISubscriptionRepository = prisma;
  }
  async create(data: ISubscriptions): Promise<ISubscriptions> {
    const user = await this.userService.findOne(data.userId);
    if (!user.status) {
      throw new BaseError(
        "user account desabled, please contact suport!",
        new Error().stack,
        "contact suport",
        400,
        "service:subscription:create",
        "user"
      );
    }
    try {
      const findPlans = await this.plansService.findOne(data.plansId);
      if (!findPlans) {
        throw new BaseError(
          "o plano seleconado nao se encontra disponivel!",
          "",
          "contacta o suporte",
          400,
          "",
          "plans"
        );
      }

      const findSubscritionUserActive = await this.findOne({
        userId: data.userId,
        status: true,
        plansId: data.plansId,
      });
      if (findSubscritionUserActive) {
        throw new BaseError(
          "Ja se encontra escrito nesse plano apenas estende a data!",
          new Error().stack,
          " Estende a data",
          400,
          "service:subscription:",
          "data:subscrption"
        );
      }
      const subscription =
        await this.ISubscriptionRepository.subscription.create({
          data: {
            plansId: data.plansId,
            userId: data.userId,
            endDate: data.endDate,
            startDate: data.startDate,
            status: data.status,
          },
          include: { User: true, plans: true },
        });
      return subscription;
    } catch (error: any) {
      throw new BaseError(
        error.message,
        error.stack,
        "subscription",
        400,
        "service:subscription:create",
        "subscrition"
      );
    }
  }

  async findOne(where: Prisma.subscriptionWhereInput): Promise<ISubscriptions> {
    return this.ISubscriptionRepository.subscription.findFirst({ where });
  }
  async disabled(id: number, type: boolean): Promise<ISubscriptions> {
    return await this.ISubscriptionRepository.subscription.update({
      data: { status: type },
      where: { id: id },
    });
  }
  delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  update(
    id: number,
    data: ISubscriptions
  ): Promise<Prisma.subscriptionCreateManyInput> {
    throw new Error("Method not implemented.");
  }
}
