import { injectable } from "tsyringe";
import { prisma } from "@shared/infra/database/database";
import { IStatus, IUser } from "../dto/user.dto";
import { Prisma, PrismaClient } from "@prisma/client";
import { BaseError } from "@errors/Base";
import { User } from "../dto/services.dto";
import { getPagination } from "@core/utils/util";
import { PAGE_SIZE_DEFAULT } from "@core/config/index";

@injectable()
export class UserService implements User {
  private readonly UserRepository: PrismaClient
  constructor() {
    this.UserRepository = prisma
  }
  public async create(User: IUser): Promise<IUser> {
    try {
      const user = await this.where({
        OR: [{ email: User.email }, { username: User.username }],
      });
      if (user) {
        throw new BaseError(
          "email ou nome de usuarios informado ja existe !",
          new Error().stack,
          "username",
          400,
          "SERVICE:USER:CREATE",
          "USERNAME"
        );
      }
      const data = await this.UserRepository.user.create({
        data: {
          name: User.name,
          username: User.username,
          email: User.email,
          password: User.password,
          endereco: User.endereco,
          status: User.status,
          features: User.features,
        },
      });

      return data;
    } catch (error: any) {
      throw new BaseError(
        error.message,
        error.stack,
        "",
        error.statusCode,
        "SERVICE:USER:CREATE",
        "CREATE"
      );
    }
  }
  public async findAll(): Promise<Prisma.UserCreateInput[]> {
    return this.UserRepository.user.findMany();
  }

  public async where(
    where: Prisma.UserWhereInput
  ): Promise< IUser | undefined> {
    return (await this.UserRepository.user.findFirst({
      where,
    })) as IUser;
  }
  public async filteredUser(
    params: {
      page: number;
      orderBy?: Prisma.UserOrderByWithAggregationInput;
    },
    searchParams: string
  ): Promise<Prisma.UserCreateInput[]> {
    try {
      const { page, orderBy } = params;
      const { skip, take } = getPagination(page, PAGE_SIZE_DEFAULT);
      const filteredUser = await this.UserRepository.user.findMany({
        skip,
        take,
        where: {
          OR: [
            { username: { contains: searchParams } },
            { email: { contains: searchParams } },
            { endereco: { contains: searchParams } },
            { name: { contains: searchParams } },
          ],
        },
        orderBy,
      });

      if (!filteredUser || filteredUser.length === 0) {
        throw new BaseError(
          "user not found",
          new Error().stack,
          `${searchParams}`,
          404,
          "service:user:filtered-user",
          `${searchParams}`
        );
      }

      return filteredUser;
    } catch (error: any) {
      throw new BaseError(
        error.message,
        error.stack,
        `filtered`,
        error.statusCode || 400,
        `service:user:search`,
        `${searchParams}`
      );
    }
  }
  public async AddFeatures(
    id: number,
    features: []
  ): Promise<IUser | undefined> {
    if (!features || features.length === 0) {
      throw new BaseError(
        "invalid params features",
        new Error().stack,
        `${features}`,
        400,
        "service:user:addfeatures",
        `${features}`
      );
    }
    const findUser = await this.findOne(id);
    if (!findUser) {
      throw new BaseError(
        "invalid id",
        new Error().stack,
        `verifica o ${id} fornecido`,
        404,
        "service:user:addfeatures",
        `${id}`
      );
    }
    for (const f in features) findUser.features?.push(features[f]);
    const user = await this.update(id, findUser);
    return user;
  }
  public async removeFeatures(
    id: number,
    features: []
  ): Promise<IUser | undefined> {
    const user = await this.findOne(id);
    const newFeatured = user.features?.filter(
      (feature) => !features.includes(feature as never)
    );
    user.features = newFeatured;
    return await this.update(id, user);
  }
  public async status(User: IStatus): Promise<IUser | undefined> {
    return (await this.UserRepository.user.update({
      data: {
        status: User.status,
      },
      where: { id: User.id },
    })) as IUser;
  }
  public async findOne(id: number): Promise<IUser> {
    const user = (await this.UserRepository.user.findFirst({
      where: { id },
    })) as IUser;
    if (!user) {
      throw new BaseError(
        "usuarios nao encontrado!",
        new Error().stack,
        "Id fornecido",
        404,
        "SERVICE:USER:FINDONE",
        "ID"
      );
    }
    return user;
  }
  public async findUsername(username: string): Promise<Prisma.UserCreateInput> {
    const user = await this.UserRepository.user.findFirst({
      where: { username: username },
    });
    if (!user) {
      throw new BaseError(
        "usuarios nao encontrado!",
        new Error().stack,
        "Username fornecido",
        404,
        "SERVICE:USER:FINDONEUSERNAME",
        "username"
      );
    }

    return user;
  }

  public async update(id: number, data: IUser): Promise<IUser | undefined> {
    const row = (await this.UserRepository.user.update({
      data,
      where: { id },
    })) as IUser;
    return row;
  }
  public async delete(id: number): Promise<Prisma.UserCreateInput> {
    const user = await this.UserRepository.user.delete({
      where: { id },
    });
    return user;
  }
}
