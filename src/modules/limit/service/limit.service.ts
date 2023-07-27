import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@shared/infra/database/database";
import { getPagination } from "@utils/util";
import { BaseError } from "@errors/Base";
import { injectable } from "tsyringe";
import { Limit } from "../dto/limit.dto";

@injectable()
export class LimitService implements Limit {
  private LimitRepository: PrismaClient;
  constructor() {
    this.LimitRepository = prisma;
  }
  async create(
    data: Prisma.limitCreateManyInput
  ): Promise<Prisma.limitCreateManyInput> {
    return await this.LimitRepository.limit.create({ data });
  }
  async delete(id: number): Promise<any> {
    return await this.LimitRepository.limit.delete({ where: { id } });
  }
  async update(
    id: number,
    data: Prisma.limitCreateManyInput
  ): Promise<Prisma.limitCreateManyInput> {
    return await this.LimitRepository.limit.update({ data, where: { id } });
  }
  async findAll(page?: number | undefined): Promise<Prisma.limitCreateInput[]> {
    const pageNumber = page ? page : 0;
    const { take, skip } = getPagination(pageNumber, 20);
    return await this.LimitRepository.limit.findMany({ skip, take });
  }
  async findOne(id?: number | undefined): Promise<Prisma.limitCreateInput> {
    const limit = await this.LimitRepository.limit.findFirst({
      where: { id },
    });
    if (!limit)
      throw new BaseError(
        "limit not found",
        new Error().stack,
        "verifica o id",
        404,
        "service:limit:findone",
        "id"
      );
    return limit;
  }
}
