import { Prisma } from "@prisma/client";
import { IStatus, IUser } from "./user.dto";

export interface IuserService {
  create(User: IUser): Promise<Prisma.UserCreateInput>;
  findAll(): Promise<Prisma.UserCreateInput[]>;
  where(
    where: Prisma.UserWhereInput
  ): Promise<Prisma.UserCreateInput | undefined>;
  filteredUser(
    params: {
      page: number;
      orderBy?: Prisma.UserOrderByWithAggregationInput;
    },
    searchParams: string
  ): Promise<Prisma.UserCreateInput[]>;
  AddFeatures(id: number, features: []): Promise<IUser | undefined>;
  removeFeatures(id: number, features: []): Promise<IUser | undefined>;
  status(User: IStatus): Promise<IUser | undefined>;
  findOne(id: number): Promise<IUser>;
  findUsername(username: string): Promise<Prisma.UserCreateInput>;
  update(id: number, data: IUser): Promise<IUser | undefined>;
  delete(id: number): Promise<Prisma.UserCreateInput>;
}
