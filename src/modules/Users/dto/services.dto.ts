import { Prisma } from "@prisma/client";
import { IStatus, IUser } from "./user.dto";
import { Request,Response } from "express";

export interface User {
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

export interface IAuth {
  Login(data: IAuthUser): Promise<{ access_token: string }>;
  signup(data: ISignup): Promise<{ message: string; data: IUser }>;
}

export interface AuthController {
  Login(req: Request, res: Response): Promise<Response>;
  singup(req: Request, res: Response): Promise<Response>;
}

export interface ISignup {
  name: string;
  email: string;
  username: string;
  password: string;
}
export interface IAuthUser {
  username: string;
  password: string;
}
