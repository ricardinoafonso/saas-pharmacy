import { Prisma } from "@prisma/client";

export interface Company {
  create(
    data: ICompanyDTO
  ): Promise<ICompanyDTO>;
  findByUserId(
    id: number,
    page?: number,
    orderBy?: Prisma.companyAvgOrderByAggregateInput,
    search?: string
  ): Promise<{
    currentPage: number;
    totalPages: number;
    result: any;
    count: number;
  }>;
  findAll(
    search?: string,
    page?: number,
    orderBy?: Prisma.companyAvgOrderByAggregateInput
  ): Promise<{
    currentPage: number;
    totalPages: number;
    result: any;
    count: number;
  }>;
  update(
    where: Prisma.companyWhereInput,
    data: ICompanyDTO
  ): Promise<Prisma.BatchPayload>;
  delete(where: Prisma.companyWhereInput): Promise<Prisma.BatchPayload>;
  find(where: Prisma.companyWhereInput): Promise<ICompanyDTO>;
}

export type ICompanyDTO = {
  id?: number;
  name: string | undefined;
  email: string | undefined;
  telefone: string | undefined;
  endereco: string | undefined;
  nif: string | undefined;
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
