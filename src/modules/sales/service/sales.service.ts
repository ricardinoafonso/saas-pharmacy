import { inject, injectable } from "tsyringe";
import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@shared/infra/database/database";
import {  Items, SalesCreate, SalesDto, Total } from "../dto/sales.dto";
import { BaseError } from "@errors/Base";
import { getPagination, getPercentaged } from "@utils/util";
import { PAGE_SIZE_DEFAULT } from "@config/index";
import { ProductService } from "@modules/product/service/product.service";

@injectable()
export class SalesServices implements SalesDto {
  private SalesRepository: PrismaClient;
  constructor(@inject("productService") private productService: ProductService) {
    this.SalesRepository = prisma;
  }
  async create(data: SalesCreate): Promise<any> {
    const { total } = await this.itemsQuantityCheckAndGetTotalValue<number>(
      data.salesItem,
      data.companyId
    );
    try {
      const sales = this.SalesRepository.sales.create({
        data: {
          total: total,
          companyId: data.companyId,
          employeeId: data.employeeId,
          paymentType: data.paymentType,
          salesItem: {
            createMany: {
              data: data.salesItem,
            },
          },
        },
      }); 
      return sales;
    } catch (error) {
      throw new BaseError(
        error.message,
        error.stack,
        "create",
        400,
        "sales:create",
        ""
      );
    }
  }

  async findOne(params: { id?: number; companyId?: number }): Promise<any> {
    try {
      return await this.SalesRepository.sales.findFirst({
        where: {
          id: params.id,
          companyId: params.companyId,
        },
      });
    } catch (error) {
      throw new BaseError(
        error.message,
        error.stack,
        "findone",
        400,
        "sales:findone"
      );
    }
  }
  async delete(params: {
    id?: number;
    companyId?: number;
  }): Promise<Prisma.BatchPayload> {
    try {
      return await this.SalesRepository.sales.deleteMany({
        where: {
          id: params.id,
          companyId: params.companyId,
        },
      });
    } catch (error) {
      throw new BaseError(
        "servico indisponivel",
        error.stack,
        "delete",
        400,
        "service:sales",
        "delete"
      );
    }
  }
  async findAll(
    page?: number,
    companyId?: number,
    sort?: Prisma.salesAvgOrderByAggregateInput,
    employees?: number
  ): Promise<any> {
    const pageNumber = page ? page : 0;
    const { take, skip } = getPagination(pageNumber, PAGE_SIZE_DEFAULT);
    try {
      if (employees) {
        return await this.SalesRepository.sales.findMany({
          skip,
          take,
          where: {
            employeeId: employees,
            companyId: companyId,
          },
          orderBy: sort,
          include: {
            employe: true,
            company: true,
          },
        });
      }

      const sales = await this.SalesRepository.sales.findMany({
        skip,
        take,
        orderBy: sort,
        where: {
          companyId: companyId,
        },
        include: {
          employe: true,
          company: true,
        },
      });
      return sales;
    } catch (error) {
      throw new BaseError(
        error.message,
        error.stack,
        "sales",
        400,
        "service:sales",
        "sales"
      );
    }
  }
  private async itemsQuantityCheckAndGetTotalValue<T>(
    items: Items[],
    companyId: number
  ): Promise<{ total: number }> {
    let products: Total[] = [];
    try {
      for (const item in items) {
        const product = await this.productService.findOne(
          items[item].productId,
          companyId
        );
        if (product) {
          if (product.quantity < items[item].quantity) {
            throw new BaseError(
              `Product ${product.name} quantity is low`,
              new Error().stack,
              "Product",
              400,
              "salesService",
              "product"
            );
          }
          
          const quantityUpdate = product.quantity - items[item].quantity
          await this.productService.update({ quantity: quantityUpdate},{ id: items[item].productId,
            companyId: companyId})

          products.push({
            price:  product.price + getPercentaged(product.price, product.iva ),
            quantity: items[item].quantity,
          });

        } else {
          throw new BaseError(
            `Product ${product.name} not found`,
            new Error().stack,
            "Product",
            404,
            "salesService",
            "product"
          );
        }
      }
    } catch (error) {
      throw new BaseError(
        error.message,
        error.stack,
        "create",
        400,
        "service:sales",
        ""
      );
    }
    return { total: this.geTotal(products) };
  }
  private geTotal(data: Total[]): number {
    return data.reduce((sum, product) => {
      return sum + product.quantity * product.price;
    }, 0);
  }
}
