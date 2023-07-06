import { Prisma } from "@prisma/client";

export interface IplansService {
  create(data: Prisma.plansCreateInput): Promise<Prisma.plansCreateInput>;
  delete(id: number): Promise<any>;
  update(
    id: number,
    data: Prisma.plansCreateInput
  ): Promise<Prisma.plansUpdateInput>;
  findAll(page?: number): Promise<Prisma.plansCreateInput[]>;
  findOne(id?: number): Promise<Prisma.plansCreateInput>;
}

export interface IplansCreateInput {
  id?: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
