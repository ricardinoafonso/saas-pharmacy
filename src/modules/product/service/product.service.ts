import { Prisma, PrismaClient } from "@prisma/client";
import { ProductTypes } from "../dto/product.td";
import { inject, injectable } from "tsyringe";
import { prisma } from "@shared/infra/database/database";
import { BaseError } from "@errors/Base";
import { getPagination } from "@utils/util";
import { Component, FindAll, FindOne } from "@shared/dto/component";
import { Can } from "@shared/authorization/can";
import { PAGE_SIZE_DEFAULT } from "@config/index";

@injectable()
export class ProductService
  implements
    Component<ProductTypes>,
    FindAll<ProductTypes[], Prisma.productAvgOrderByAggregateInput, number, number, string>,
    FindOne<ProductTypes, number, number>
{
  private ProductRepository: PrismaClient;
  constructor(@inject("can") private can: Can) {
    this.ProductRepository = prisma;
  }
  async create(data: ProductTypes, id?: number): Promise<ProductTypes> {
    await this.can.Can(data.companyId, id);
    try {
      const findNameOrCodeProduct = await this.find({
        OR: [{ name: data.name }, { code: data.code }],
      });
      if (findNameOrCodeProduct) {
        throw new BaseError(" por favor tente outro nome", "", "name", 400, "service:create:name", "name");
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
      throw new BaseError(error.message, error.stack, "vefirique os dados", 400, "service:product:create", "data");
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
  async findAll(
    page?: number,
    id?: number,
    sort?: Prisma.productAvgOrderByAggregateInput,
    search?: string
  ): Promise<ProductTypes[]> {
    const pageNumber = page ? page : 0;
    const { take, skip } = getPagination(pageNumber, PAGE_SIZE_DEFAULT);
    let product: any;
    console.log(take, skip, id, sort, search);
    if (search === "undefined") {
      product = await this.ProductRepository.product.findMany({
        take,
        skip,
        where: {
          companyId: id,
        },
        orderBy: sort,
      });
    } else {
      product = await this.ProductRepository.product.findMany({
        take,
        skip,
        where: {
          companyId: id,
          OR: [{ name: { contains: search } }, { localization: { contains: search } }],
        },
        orderBy: sort,
        include: {
          categorie: true,
        },
      });
    }

    return product;
  }
  async delete(id?: number, companyId?: number, userId?: number): Promise<Prisma.BatchPayload> {
    await this.can.Can(parseInt(`${companyId}`), userId);
    return await this.ProductRepository.product.deleteMany({
      where: {
        id: id,
        companyId: companyId,
      },
    });
  }
  async update(data: ProductTypes, where: Prisma.productWhereInput, id?: number): Promise<Prisma.BatchPayload> {
    const { companyId } = where;
    await this.can.Can(parseInt(`${companyId}`), id);
    return await this.ProductRepository.product.updateMany({
      data,
      where,
    });
  }
}
