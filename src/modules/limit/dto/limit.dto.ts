import { Prisma } from "@prisma/client";

export interface Ilimit {
  create(data: Prisma.limitCreateManyInput): Promise<Prisma.limitCreateManyInput>;
  delete(id: number): Promise<any>;
  update(
    id: number,
    data: Prisma.limitCreateManyInput
  ): Promise<Prisma.limitCreateManyInput>;
  findAll(page?: number): Promise<Prisma.limitCreateInput[]>;
  findOne(id?: number): Promise<Prisma.limitCreateInput>;
}

export interface IlimitCreateInput {
    id?: number;
    company_number: number;
    employers: number;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
