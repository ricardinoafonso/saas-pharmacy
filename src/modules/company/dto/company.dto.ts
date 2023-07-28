import { Prisma } from "@prisma/client";

export interface Company {
  create(
    data: Prisma.companyCreateInput
  ): Promise<Prisma.companyCreateManyUserInput>;
  findAll(): Promise<Prisma.UserCreateInput[]>;
  findByUserId(
    id: number,
    page?: number,
    orderBy?: Prisma.companyAvgOrderByAggregateInput,
    search?: string
  ): Promise<Prisma.companyCreateManyInput[]>;
  findAll(
    search?: string,
    page?: number,
    orderBy?: Prisma.companyAvgOrderByAggregateInput
  ): Promise<Prisma.companyCreateManyInput[]>;
  update(
    where: Prisma.companyWhereInput,
    data: Prisma.companyCreateInput
  ): Promise<Prisma.BatchPayload>;
  delete(where: Prisma.companyWhereInput): Promise<Prisma.BatchPayload>;
}

export type Icompanydto = {
  id?: number;
  name?: string | undefined;
  email?: string | undefined;
  telefone?: string | undefined;
  endereco?: string | undefined;
  nif?: string | undefined;
  userId?: number | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};

export type IcompanyArgsWhere = {
  userId: number;
  companyId: number;
};

export type IcompanyFind = {
  search?: string;
  page?: number;
  orderBy?: any;
};
