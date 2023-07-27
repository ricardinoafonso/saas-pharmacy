import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";
import { prisma } from "@shared/infra/database/database";
import { Plans} from "../dto/plans.dto";
import { getPagination } from "@utils/util";
import { BaseError } from "@errors/Base";
import { PAGE_SIZE_DEFAULT } from "@config/index";

@injectable()
export class PlansService implements Plans {
  private PlansRepository: PrismaClient;
  constructor() {
    this.PlansRepository = prisma;
  }
  async create(
    data: Prisma.plansCreateInput
  ): Promise<Prisma.plansCreateInput> {
    return await this.PlansRepository.plans.create({ data });
  }
  async delete(id: number): Promise<Prisma.plansCreateInput> {
    return await this.PlansRepository.plans.delete({ where: { id } });
  }
  async update(
    id: number,
    data: Prisma.plansCreateInput
  ): Promise<Prisma.plansUpdateInput> {
    return await this.PlansRepository.plans.update({ data, where: { id } });
  }
  async findAll(page?: number | undefined): Promise<Prisma.plansCreateInput[]> {
    const pageNumber = page ? page : 0;
    const { take, skip } = getPagination(pageNumber, PAGE_SIZE_DEFAULT);
    const plans = await this.PlansRepository.plans.findMany({
      skip,
      take,
    });
    if (!plans)
      throw new BaseError(
        "No have plans found",
        new Error().stack,
        "not found try again later",
        404,
        "service:plans:findOne",
        "Not"
      );
    return plans
  }
  async findOne(id?: number | undefined): Promise<Prisma.plansCreateInput> {
    const plans = await this.PlansRepository.plans.findFirst({ where: { id } });
    if (!plans)
      throw new BaseError(
        "No plans found",
        new Error().stack,
        "not found try again later",
        404,
        "service:plans:findOne",
        "Not"
      );
    return plans;
  }
}
