import { injectable } from "tsyringe";
import { Categories, ICategories } from "../dto/categories.dto";
import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@shared/infra/database/database";
import { BadRequest, NotFound } from "@errors/Base";
import { PaginationData, getData, getPagination } from "@core/utils/util";
import { PAGE_SIZE_DEFAULT } from "@core/config";
@injectable()
export class CategoriesServices implements ICategories {
  private CategoriesRepository: PrismaClient;
  constructor() {
    this.CategoriesRepository = prisma;
  }
 async create(data: Categories): Promise<Categories> {
    const categorie = await this.where({ name: data.name})
    if(categorie)
        throw new BadRequest("essa categoria ja existe tenta outra!",'categorie name')
    return this.CategoriesRepository.categorie.create({ data: { ...data } });
  }
  async delete(id: number): Promise<Categories> {
    const user = await this.CategoriesRepository.categorie.delete({
      where: { id },
    });
    return user;
  }
  async update(id: number, data: Categories): Promise<Categories> {
    const user = await this.CategoriesRepository.categorie.update({
      data,
      where: { id },
    });
    return user;
  }
  async findOne(id: number): Promise<Categories> {
    const Finduser = await this.CategoriesRepository.categorie.findFirst({
      where: { id },
    });
    if (!Finduser)
      throw new NotFound(
        "categorie not found",
        new Error().stack
      );
    return Finduser;
  }
 private async search(
    page?: number,
    sort?: Prisma.salesAvgOrderByAggregateInput,
    search?: string
  ): Promise<{
    currentPage: number;
    totalPages: number;
    result: any;
    count: number;
  }> {
    const pageNumber = page ? page : 0;
    const { take, skip } = getPagination(pageNumber, PAGE_SIZE_DEFAULT);
    const Categories = await this.CategoriesRepository.$transaction([
      this.CategoriesRepository.categorie.count({
        where: {
          name: {
            mode: "insensitive",
            contains: search,
          },
        },
        select: {
          _all: true,
        },
      }),
      this.CategoriesRepository.categorie.findMany({
        skip,
        take,
        orderBy: sort,
        where: {
          name: {
            mode: "insensitive",
            contains: search,
          },
        },
      }),
    ]);

    return getData(Categories,pageNumber,take);
  }

  private async where ( where: Prisma.categorieWhereInput) : Promise<Categories> {
    return await this.CategoriesRepository.categorie.findFirst({ where})
  }

  async findAll(
    page?: number,
    sort?: Prisma.salesAvgOrderByAggregateInput, search?: string
  ): Promise<{
    currentPage: number;
    totalPages: number;
    result: any;
    count: number;
  }> {
    const pageNumber = page ? page : 0;
    const { take, skip } = getPagination(pageNumber, PAGE_SIZE_DEFAULT);

    if(!search || search === undefined)
        this.search (pageNumber, sort, search)

    const Categories = await this.CategoriesRepository.$transaction([
      this.CategoriesRepository.categorie.count({
        select: {
          _all: true,
        },
      }),
      this.CategoriesRepository.categorie.findMany({
        skip,
        take,
        orderBy: sort,
      }),
    ]);

    const data = PaginationData(
      { count: Categories[0]._all, result: Categories[1] },
      pageNumber,
      take
    );
    return data;
  }
}
