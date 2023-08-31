import { Prisma } from "@prisma/client";

export interface Limit {
  create(
    data: Prisma.limitCreateManyInput
  ): Promise<Prisma.limitCreateManyInput>;
  delete(id: number): Promise<any>;
  update(
    id: number,
    data: Prisma.limitCreateManyInput
  ): Promise<Prisma.limitCreateManyInput>;
  findAll(page?: number): Promise<Prisma.limitCreateInput[]>;
  findOne(id?: number): Promise<Prisma.limitCreateInput>;
  findWhere(where: Prisma.limitWhereInput): Promise<IlimitCreateInput>;
}

export interface IlimitCreateInput {
  id?: number;
  company_number: number;
  employers: number;
  plansId?: number;
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
}
