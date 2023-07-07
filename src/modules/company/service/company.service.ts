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
  async updateByRoot(
    id: number,
    data: Prisma.companyCreateInput
  ): Promise<Prisma.companyUpdateInput> {
    return await this.ICompanyRepository.company.update({
      data,
      where: { id },
    });
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
      const company = await this.ICompanyRepository.company.findMany({
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

      if (!company) {
        throw new BaseError(
          "company not found",
          new Error().stack,
          " Not more result",
          404,
          "service:company:findUserById",
          "findUserById"
        );
      }
    }

    const company = await this.ICompanyRepository.company.findMany({
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

    if (!company) {
      throw new BaseError(
        "company not found",
        new Error().stack,
        " Not more result",
        404,
        "service:company:findUserById",
        "findUserById"
      );
    }

    return company;
  }

  async findOne(id: number): Promise<Prisma.companyCreateInput | undefined> {
    const company = await this.ICompanyRepository.company.findFirst({
      where: { id },
    });
    if (!company)
      throw new BaseError(
        "company not found",
        new Error().stack,
        "verifica o id",
        404,
        "service:company:findOne",
        "id"
      );
    return company;
  }
  async findAll(
    search?: string,
    page?: number,
    orderBy?: Prisma.companyAvgOrderByAggregateInput
  ): Promise<Prisma.companyCreateManyInput[]> {
    let pageNumber = page === undefined ? 0 : page;
    const { take, skip } = getPagination(pageNumber, 20);
    if (!search) {
      const company = await this.ICompanyRepository.company.findMany({
        skip,
        take,
        orderBy: {
          name: "desc",
        },
      });
      if (!company) {
        throw new BaseError(
          "company not found",
          new Error().stack,
          " Not more result",
          404,
          "service:company:findAll",
          "FindAll"
        );
      }
      return company;
    }

    const companyPagination = this.ICompanyRepository.company.findMany({
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

    if (!companyPagination) {
      throw new BaseError(
        "company not found pagination",
        new Error().stack,
        " Not more result",
        404,
        "service:company:findAll",
        "Pagination"
      );
    }

    return companyPagination;
  }
}
