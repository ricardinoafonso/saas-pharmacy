import { inject, injectable } from "tsyringe";
import { Company, ICompanyDTO } from "../dto/company.dto";
import { Prisma, PrismaClient } from "@prisma/client";
import { getData, getPagination } from "@core/utils/util";
import { BadRequest, BaseError } from "@errors/Base";
import { prisma } from "@shared/infra/database/database";
import { Can } from "@shared/authorization/can";
import { PAGE_SIZE_DEFAULT } from "../../../../core/config/index";
import { CompanyValidation } from "../validation/validation";

@injectable()
export class CompanyService implements Company {
  private readonly CompanyRepository: PrismaClient;
  constructor(
    @inject("can") private can: Can,
    @inject("companyValidation") private companyValidation: CompanyValidation
  ) {
    this.CompanyRepository = prisma;
  }
  async create(data: ICompanyDTO): Promise<ICompanyDTO> {
    await this.companyValidation.validationCompany(data);
    // check if this user can create this company
    await this.can.check(data.userId);

    const alreadyExists = await this.find({
      OR: [{ nif: data.nif }, { name: data.name }],
    });
    /**
     * check already exists nif or name
     */
    if (alreadyExists)
      throw new BaseError(
        "company or nif already exists.",
        "",
        "nif or name",
        400,
        "service:company",
        ""
      );
    const company = await this.CompanyRepository.company.create({
      data,
      include: { User: true },
    });
    return company;
  }
  async find(where: Prisma.companyWhereInput): Promise<ICompanyDTO> {
    return this.CompanyRepository.company.findFirst({ where });
  }

  async count(where: Prisma.companyWhereInput): Promise<{ _all: number }> {
    return await this.CompanyRepository.company.count({
      select: {
        _all: true,
      },
      where,
    });
  }
  async delete(where: Prisma.companyWhereInput): Promise<Prisma.BatchPayload> {
    const company = await this.CompanyRepository.company.deleteMany({
      where,
    });
    return company;
  }
  async updateByRoot(
    id: number,
    data: ICompanyDTO
  ): Promise<ICompanyDTO> {
    return await this.CompanyRepository.company.update({
      data,
      where: { id },
    });
  }
  async update(
    where: Prisma.companyWhereInput,
    data: ICompanyDTO
  ): Promise<Prisma.BatchPayload> {
    await this.companyValidation.validationCompany(data);
    const company = await this.CompanyRepository.company.updateMany({
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
  ): Promise<{
    currentPage: number;
    totalPages: number;
    result: any;
    count: number;
  }> {
    const Page = page ? page : 0;
    const { take, skip } = getPagination(Page, PAGE_SIZE_DEFAULT);
    if (search) return this.IsSearch(search, Page, id);
    const company = await this.CompanyRepository.$transaction([
      this.CompanyRepository.company.count({
        where: { userId: id },
        select: { _all: true },
      }),
      this.CompanyRepository.company.findMany({
        take,
        skip,
        orderBy: orderBy,
        where: {
          userId: id,
        },
      }),
    ]);
    return getData(company, Page, take);
  }

  async findOne(id: number): Promise<ICompanyDTO> {
    const company = await this.CompanyRepository.company.findFirst({
      where: { id },
      include: {
        User: true,
      },
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
  async where(
    where: Prisma.companyWhereInput
  ): Promise<Prisma.companyCreateInput> {
    try {
      return this.CompanyRepository.company.findFirst({ where });
    } catch (error) {
    throw new BadRequest(error.message, error.stack)
    }
    
  }

  private async IsSearch(
    search: string,
    page?: number,
    userId?: number
  ): Promise<{
    currentPage: number;
    totalPages: number;
    result: any;
    count: number;
  }> {
    let transaction = null;
    let pageNumber = page === undefined ? 0 : page;
    const { take, skip } = getPagination(pageNumber, 20);
    if (!userId) {
      transaction = await this.CompanyRepository.$transaction([
        this.CompanyRepository.company.count({ select: { _all: true } }),
        this.CompanyRepository.company.findMany({ take, skip }),
      ]);

      return getData(transaction, pageNumber, take);
    }

    transaction = await this.CompanyRepository.$transaction([
      this.CompanyRepository.company.count({
        where: { userId: userId },
        select: { _all: true },
      }),
      this.CompanyRepository.company.findMany({
        take,
        skip,
        where: {
          OR: [
            { name: { contains: search } },
            { nif: { contains: search } },
            { endereco: { contains: search } },
            { email: { contains: search } },
          ],
        },
      }),
    ]);
    return getData(transaction, pageNumber, take);
  }
  async findAll(
    search?: string,
    page?: number,
    orderBy?: Prisma.companyAvgOrderByAggregateInput
  ): Promise<{
    currentPage: number;
    totalPages: number;
    result: any;
    count: number;
  }> {
    let pageNumber = page === undefined ? 0 : page;
    const { take, skip } = getPagination(pageNumber, 20);
    if (search) return this.IsSearch(search, pageNumber);
    const company = await this.CompanyRepository.$transaction([
      this.CompanyRepository.company.count({ select: { _all: true } }),
      this.CompanyRepository.company.findMany({
        take,
        skip,
        orderBy: orderBy,
      }),
    ]);
    return getData(company, pageNumber, take);
  }
}
