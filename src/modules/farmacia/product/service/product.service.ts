import { Prisma, PrismaClient } from "@prisma/client";
import { ProductTypes } from "../dto/product.td";
import { inject, injectable } from "tsyringe";
import { prisma } from "@shared/infra/database/database";
import { BadRequest, BaseError } from "@errors/Base";
import { getPagination, getData } from "@core/utils/util";
import { Component, FindAll, FindOne } from "@shared/dto/component";
import { Can } from "@shared/authorization/can";
import { PAGE_SIZE_DEFAULT } from "@core/config/index";

@injectable()
export class ProductService
  implements
    Component<ProductTypes>,
    FindAll<
      {
        currentPage: number;
        totalPages: number;
        result: any;
        count: number;
      },
      Prisma.productAvgOrderByAggregateInput,
      number,
      number,
      string
    >,
    FindOne<ProductTypes, number, number>
{
  private ProductRepository: PrismaClient;
  constructor(@inject("can") private can: Can) {
    this.ProductRepository = prisma;
  }
  async create(data: ProductTypes, userId?: number): Promise<ProductTypes> {
    await this.can.checkIfUserAlreadyPermissionToCompleteThisAction(
      data.companyId,
      userId
    );
    try {
      const findNameOrCodeProduct = await this.find({
        OR: [{ name: data.name }, { code: data.code }],
      });
      if (findNameOrCodeProduct) {
        throw new BaseError(
          " por favor tente outro nome",
          "",
          "name",
          400,
          "service:create:name",
          "name"
        );
      }
      return this.ProductRepository.product.create({
        data: {
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          localization: data.localization,
          discount: data.discount,
          priceBuy: data.priceBuy,
          iva: data.iva,
          categorieId: data.categorieId,
          companyId: data.companyId,
          code: data.code,
        },
      });
    } catch (error) {
      throw new BaseError(
        error.message,
        error.stack,
        "vefirique os dados",
        400,
        "service:product:create",
        "data"
      );
    }
  }
  async findOne(id: number, company?: number): Promise<ProductTypes> {
    return await this.ProductRepository.product.findFirst({
      where: { id: id, companyId: company },
    });
  }
  async find(where: Prisma.productWhereInput): Promise<ProductTypes> {
    return this.ProductRepository.product.findFirst({ where });
  }
  private async Search(
    id: number,
    page: number,
    sort?: Prisma.productAvgOrderByAggregateInput,
    search?: string
  ): Promise<{
    currentPage: number;
    totalPages: number;
    result: any;
    count: number;
  }> {
    const { skip, take } = getPagination(page, PAGE_SIZE_DEFAULT);
    const transaction = await this.ProductRepository.$transaction([
      this.ProductRepository.product.count({
        where: {
          companyId: id,
        },
        select: { _all: true },
      }),
      this.ProductRepository.product.findMany({
        skip,
        take,
        orderBy: sort,
        where: {
          companyId: id,
          OR: [
            { name: { contains: search } },
            { localization: { contains: search } },
            {
              categorie: {
                name: { contains: search },
              },
            },
          ],
        },
        include: {
          categorie: true,
        },
      }),
    ]);
    return getData(transaction, page, take);
  }
  async findAll(
    page?: number,
    id?: number,
    sort?: Prisma.productAvgOrderByAggregateInput,
    search?: string
  ): Promise<{
    currentPage: number;
    totalPages: number;
    result: any;
    count: number;
  }> {
    const pageNumber = page ? page : 0;
    const { take, skip } = getPagination(pageNumber, PAGE_SIZE_DEFAULT);
    try {
      if (search) return this.Search(id, pageNumber, sort, search);
      const transaction = await this.ProductRepository.$transaction([
        this.ProductRepository.product.count({
          where: {
            companyId: id,
          },
          select: { _all: true },
        }),
        this.ProductRepository.product.findMany({
          take,
          skip,
          where: {
            companyId: id,
          },
          orderBy: sort,
          include: {
            categorie: true,
          },
        }),
      ]);

      return getData(transaction, pageNumber, take);
    } catch (error) {
      throw new BadRequest(error.message, "");
    }
  }
  async delete(
    id?: number,
    companyId?: number,
    userId?: number
  ): Promise<Prisma.BatchPayload> {
    await this.can.checkIfUserAlreadyPermissionToCompleteThisAction(
      parseInt(`${companyId}`),
      userId
    );
    return await this.ProductRepository.product.deleteMany({
      where: {
        id: id,
        companyId: companyId,
      },
    });
  }
  async update(
    data: ProductTypes,
    where: Prisma.productWhereInput,
    userId?: number
  ): Promise<Prisma.BatchPayload> {
    const {companyId} = where
    await this.can.checkIfUserAlreadyPermissionToCompleteThisAction(
      parseInt(`${companyId}`),
      userId
    );
    return await this.ProductRepository.product.updateMany({
      where,
      data
    });
  }
}
