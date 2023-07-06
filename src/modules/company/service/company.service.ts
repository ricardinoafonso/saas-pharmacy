import { inject, injectable } from "tsyringe";
import { IcompanyService } from "../dto/company.dto";
import { Prisma, PrismaClient } from "@prisma/client";
import { getPagination } from "@utils/util";
import { BaseError } from "@errors/Base";
import { prisma } from "@shared/infra/database/database";
import { UserService } from "@modules/Users/service/user.service";

@injectable()
export class CompanyService implements IcompanyService {
  private readonly ICompanyRepository: PrismaClient;
  constructor(
    @inject("userService") private readonly userService: UserService
  ) {
    this.ICompanyRepository = prisma;
  }
  async create(
    data: Prisma.companyCreateInput
  ): Promise<Prisma.companyCreateManyUserInput> {
    const company = await this.ICompanyRepository.company.create({
      data,
      include: { User: true },
    });
    return company;
  }
  async delete(where: Prisma.companyWhereInput): Promise<Prisma.BatchPayload> {
    const company = await this.ICompanyRepository.company.deleteMany({
      where,
    });
    return company;
  }
  async update(
    where: Prisma.companyWhereInput,
    data: Prisma.companyCreateInput
  ): Promise<Prisma.BatchPayload> {
    const company = await this.ICompanyRepository.company.updateMany({
      data,
      where,
    });
    return company;
  }
  async findByUserId(
    id: number,
    page?: number,
    orderBy?: Prisma.companyAvgOrderByAggregateInput,
    search?: string
  ): Promise<Prisma.companyCreateManyInput[]> {
    const Pagenumber = page ? page : 0;
    const { take, skip } = getPagination(Pagenumber, 20);
    const user = await this.userService.where({ id: id, status: true });
    if (!user) {
      throw new BaseError(
        "Usuario sem susbcrisao!",
        new Error().stack,
        "por favor renova sua subscrisao",
        400,
        "service:company:findByUser",
        "company"
      );
    }
    if (search) {
      return this.ICompanyRepository.company.findMany({
        skip,
        take,
        orderBy,
        where: {
          userId: id,
          OR: [
            { name: { contains: search } },
            { endereco: { contains: search } },
            { email: { contains: search } },
            { telefone: { contains: search } },
            { nif: { contains: search } },
          ],
        },
        include: { User: true },
      });
    }

    return this.ICompanyRepository.company.findMany({
      skip,
      take,
      orderBy: {
        name: "desc",
      },
      where: {
        userId: id,
      },
      include: { User: true },
    });
  }
  async findAll(
    search?: string,
    page?: number,
    orderBy?: Prisma.companyAvgOrderByAggregateInput
  ): Promise<Prisma.companyCreateManyInput[]> {
    let pageNumber = page === undefined ? 0 : page;
    const { take, skip } = getPagination(pageNumber, 20);
    if (!search) {
      return await this.ICompanyRepository.company.findMany({
        skip,
        take,
        orderBy: {
          name: "desc",
        },
      });
    }

    return this.ICompanyRepository.company.findMany({
      skip,
      take,
      orderBy,
      where: {
        OR: [
          { name: { contains: search } },
          { endereco: { contains: search } },
          { email: { contains: search } },
          { telefone: { contains: search } },
          { nif: { contains: search } },
        ],
      },
    });
  }
}
