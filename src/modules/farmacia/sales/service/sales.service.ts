import { inject, injectable } from "tsyringe";
import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@shared/infra/database/database";
import { ISales, Items, SalesCreate, SalesDto, Total } from "../dto/sales.dto";
import { BadRequest, NotFound } from "@errors/Base";
import { getData, getPagination, getPercentaged } from "@core/utils/util";
import { PAGE_SIZE_DEFAULT } from "@core/config/index";
import { ProductService } from "@modules/farmacia/product/service/product.service";
import { Can } from "@shared/authorization/can";

@injectable()
export class SalesServices implements SalesDto {
  private SalesRepository: PrismaClient;
  constructor(
    @inject("productService") private productService: ProductService,
    @inject("can") private can: Can
  ) {
    this.SalesRepository = prisma;
  }
  async update(data: ISales, userId: number): Promise<any> {
    await this.can.checkIfUserAlreadyPermissionToCompleteThisAction(
      data.companyId,
      userId
    );
    return this.SalesRepository.sales.update({
      data: {
        total: data.total,
        paymentType: data.paymentType,
        salesItem: {
          updateMany: {
            data: data.salesItem,
            where: {},
          },
        },
      },
      where: {
        id: data.id,
      },
    });
  }
  async create(data: SalesCreate, userId: number): Promise<any> {
    const { total } = await this.itemsQuantityCheckAndGetTotalValue<number>(
      data.salesItem,
      data.companyId,
      userId
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
      throw new BadRequest(error.message, "service:sales:create");
    }
  }

  async findOne(params: { id?: number; companyId?: number }): Promise<any> {
    try {
      const sale = await this.SalesRepository.sales.findFirst({
        where: {
          id: params.id,
          companyId: params.companyId,
        },
        include: {
          salesItem: true,
        },
      });
      if (!sale) throw new NotFound("sales not found", "check sales id");

      return sale;
    } catch (error) {
      throw new BadRequest(error.message, "findOne");
    }
  }
  async delete(params: {
    id?: number;
    companyId?: number;
    userId: number;
  }): Promise<any> {
    try {
      await this.can.checkIfUserAlreadyPermissionToCompleteThisAction(
        params.companyId,
        params.userId
      );
      return await this.SalesRepository.sales.delete({
        where: { id: params.id },
      });
    } catch (error) {
      throw new BadRequest("servico indisponivel", "service:sales");
    }
  }
  private async reportByEmployeeId(
    page?: number,
    companyId?: number,
    sort?: Prisma.salesAvgOrderByAggregateInput,
    employees?: number,
    params?: { start: any; end: any }
  ): Promise<{
    currentPage: number;
    totalPages: number;
    result: any;
    count: number;
  }> {
    const { take, skip } = getPagination(page, PAGE_SIZE_DEFAULT);
    const transaction = await this.SalesRepository.$transaction([
      this.SalesRepository.sales.count({
        where: {
          companyId: companyId,
          employeeId: employees,
          createdAt: {
            lte: params.end,
            gte: params.start,
          },
        },
        select: {
          _all: true,
        },
      }),
      this.SalesRepository.sales.findMany({
        take,
        skip,
        where: {
          companyId: companyId,
          employeeId: employees,
          createdAt: {
            lte: params.end,
            gte: params.start,
          },
        },
        orderBy: sort,
        include: {
          employe: true,
          company: true,
        },
      }),
    ]);
    return getData(transaction, page, take);
  }
  async findAll(
    page?: number,
    companyId?: number,
    sort?: Prisma.salesAvgOrderByAggregateInput,
    employees?: number,
    params?: { start: any; end: any }
  ): Promise<any> {
    const pageNumber = page ? page : 0;
    const { take, skip } = getPagination(pageNumber, PAGE_SIZE_DEFAULT);
    try {
      if (employees)
        return this.reportByEmployeeId(
          pageNumber,
          companyId,
          sort,
          employees,
          params
        );

      const transaction = await this.SalesRepository.$transaction([
        this.SalesRepository.sales.count({
          where: {
            companyId: companyId,
            createdAt: {
              lte: params.end,
              gte: params.start,
            },
          },
          select: {
            _all: true,
          },
        }),
        this.SalesRepository.sales.findMany({
          skip,
          take,
          orderBy: sort,
          where: {
            companyId: companyId,
            createdAt: {
              lte: params.end,
              gte: params.start,
            },
          },
          include: {
            employe: true,
            company: true,
          },
        }),
      ]);
      return getData(transaction, pageNumber, take);
    } catch (error) {
      throw new BadRequest(error.message, "service:sales:findAll");
    }
  }
  private async itemsQuantityCheckAndGetTotalValue<T>(
    items: Items[],
    companyId: number,
    userId: number
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
            throw new BadRequest(
              `Product ${product.name} quantity is low`,
              "Product"
            );
          }

          const quantityUpdate = product.quantity - items[item].quantity;
          await this.productService.update(
            { quantity: quantityUpdate },
            { id: items[item].productId, companyId: companyId },
            userId
          );

          products.push({
            price: product.price + getPercentaged(product.price, product.iva),
            quantity: items[item].quantity,
          });
        } else {
          throw new NotFound(`Product ${product.name} not found`, "Product");
        }
      }
    } catch (error) {
      throw new BadRequest(error.message, "itemsQuantityCheckAndGetTotalValue");
    }
    return { total: this.geTotal([{ price: 10, quantity: 90 }]) };
  }
  private geTotal(data: Total[]): number {
    return data.reduce((sum, product) => {
      return sum + product.quantity * product.price;
    }, 0);
  }
}
