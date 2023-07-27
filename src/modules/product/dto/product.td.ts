import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export interface Product {
  create(Data: Prisma.productCreateInput): Promise<ProductTypes>;
  findOne(params: { id?: number; companyId: number }): Promise<ProductTypes>;
  findAll(
    page?: number,
    sort?: Prisma.productAvgOrderByAggregateInput,
    search?: string
  ): Promise<ProductTypes[]>;
  delete(id?: number, companyId?: number): Promise<Prisma.BatchPayload>;
  update(
    data: ProductTypes,
    where: Prisma.productWhereInput
  ): Promise<Prisma.BatchPayload>;
}


export type ProductTypes = {
  id?: number;
  name?: string;
  price?: number;
  quantity?: number;
  localization?: string;
  discount?: number;
  priceBuy?: number;
  iva?: number;
  categorieId?: number;
  companyId?: number;
  code?: number
};
