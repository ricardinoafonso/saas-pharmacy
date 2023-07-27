import { Prisma } from "@prisma/client";

export type ISales = {
  id?: number;
  total?: number;
  employeeId?: number;
  paymentType?: string[];
  companyId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  salesItem: [
    {
      id: number;
      salesId: number;
      quantity: number;
      productId: number;
      createdAt: Date;
      updatedAt: Date;
    }
  ];
};

export type SalesCreate ={
  employeeId: number,
  paymentType: string[],
  companyId: number,
  salesItem: [
    {
      quantity: number,
      productId: number
    }
  ]
}

export type Total = {
  price: number;
  quantity: number;
};
export type Items = {
  id?: number;
  salesId?: number;
  quantity?: number;
  productId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  price?: number;
};

export interface SalesDto {
  findOne(params: { id?: number; companyId?: number }): Promise<any>;
  delete(params: {
    id?: number;
    companyId?: number;
  }): Promise<Prisma.BatchPayload>;
  findAll(
    page?: number,
    companyId?: number,
    sort?: Prisma.salesAvgOrderByAggregateInput,
    employees?: number
  ): Promise<any>;

  create(data: SalesCreate): Promise<any>;
}
