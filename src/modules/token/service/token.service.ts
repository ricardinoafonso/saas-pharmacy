import { Component } from "@shared/dto/component";
import { inject, injectable } from "tsyringe";
import { Itoken } from "../dto/dto";
import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "@shared/infra/database/database";
import { getPagination } from "@utils/util";
import { PAGE_SIZE_DEFAULT } from "@config/index";
import { BaseError } from "@errors/Base";
import { IDateProvider } from "../../../shared/infra/container/provider/DataProvider/dto";
import { JwtService } from "@shared/services/jwtService/jwtService.service";
import { EmployeesServices } from "../../employees/service/employees.service";
import { User } from "@modules/Users/dto/services.dto";

@injectable()
export class TokenService implements Component<Itoken> {
  private TokenRepository: PrismaClient;
  private user: any;
  constructor(
    @inject("DaysjsProvider") private DayJs: IDateProvider,
    @inject("jwtService") private jwtService: JwtService,
    @inject("employeesService") private employeesService: EmployeesServices,
    @inject("userService") private userService: User
  ) {
    this.TokenRepository = prisma;
  }
  async create(data: Itoken, id?: number): Promise<Itoken> {
    const token = await this.where({
      token_type: data.token_type,
      OR: [{ employeesId: data.employeesId }, { userId: data.userId }],
    });
    if (token) {
      throw new BaseError(
        "nao e possivel criar o mesmo tipo de token",
        new Error().stack,
        "type",
        400,
        "token:service,create",
        "type"
      );
    }
    return await this.TokenRepository.tokens.create({ data: { ...data } });
  }
  async refresh(token: string): Promise<any> {
    const refresh_token = await this.findOne(null, token);
    const compare = this.DayJs.compareInDays(
      this.DayJs.dateNow(),
      refresh_token.expires
    );

    try {
      await this.jwtService.verifyToken(token, "refresh");
    } catch (error) {
      if (error.stack.includes("TokenExpiredError")) {
        throw new BaseError(
          "Token expirado por favor inicia sessao novamente",
          "",
          "authorization",
          401,
          "shared:authorization",
          "authorization"
        );
      }
    }

    if (compare > 7) {
      throw new BaseError(
        "Error imposivel atualizar o token!",
        new Error().stack,
        "refresh",
        400,
        "",
        "refresh"
      );
    }

    if (refresh_token.userId)
      this.user = await this.userService.findOne(refresh_token.userId);

    if (refresh_token.employeesId)
      this.user = await this.employeesService.where({
        id: refresh_token.employeesId,
      });
    if (!this.user)
      throw new BaseError(
        "user not found!",
        new Error().stack,
        "user",
        404,
        "service:token",
        ""
      );

    if (this.user.status === false)
      throw new BaseError(
        "conta desativada, por favor atualiza sua subscrisao",
        new Error().stack,
        "user",
        423,
        "service:token",
        ""
      );
    const { password, ...payload } = this.user;
    return { acess_token: await this.jwtService.signAsync(payload) };
  }
  async findOne(id?: string, token?: string): Promise<Itoken> {
    if (!token) {
      return await this.TokenRepository.tokens.findFirst({ where: { id: id } });
    }
    return await this.TokenRepository.tokens.findFirst({
      where: { token: token },
    });
  }

  async where(
    where: Prisma.tokensWhereInput,
    types?: string,
    page?: number,
    sort?: Prisma.tokensAvgOrderByAggregateInput
  ): Promise<Itoken[] | Itoken> {
    const pgN = page ? page : 0;
    const { take, skip } = getPagination(pgN, PAGE_SIZE_DEFAULT);
    if (types === "many") {
      return this.TokenRepository.tokens.findMany({
        skip,
        take,
        where,
        orderBy: sort,
      });
    }
    return this.TokenRepository.tokens.findFirst({ where });
  }
}
