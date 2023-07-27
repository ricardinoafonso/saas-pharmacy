import { Prisma } from "@prisma/client";

export interface Keys {
  create(data: Prisma.keyCreateManyInput): Promise<Prisma.keyCreateManyInput>;
  findAll(): Promise<Prisma.keyCreateManyInput[]>;
  findOne(id?: number): Promise<IkeysDto | undefined>;
  delete(id?: number): Promise<Prisma.keyCreateManyInput>;
  encrypt(data:{plansId: number,userId: number}): { iv: string; content: string };
  descrypt(data: { iv: string; content: string }): {};
}

export interface IkeysDto {
  id?: number;
  hash?: string;
  status?: boolean;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Ikey {
  start?: Date;
  end?: Date;
  userId?: number;
  plansId?: number;
}
