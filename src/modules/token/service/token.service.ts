import { Component } from "@shared/dto/component";
import { inject, injectable } from "tsyringe";
import { Itoken } from "../dto/dto";
import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "@shared/infra/database/database";
import { getPagination } from "@core/utils/util";
import { PAGE_SIZE_DEFAULT } from "@core/config/index";
import { BadRequest, NotFound } from "@errors/Base";
import { IDateProvider } from "@shared/infra/container/provider/DataProvider/dto";
import { JwtService } from "@shared/services/jwtService/jwtService.service";

@injectable()
export class TokenService implements Component<Itoken> {
  private TokenRepository: PrismaClient;
  constructor(
    @inject("DaysjsProvider") private DayJs: IDateProvider,
    @inject("jwtService") private jwtService: JwtService
  ) {
    this.TokenRepository = prisma;
  }
  async create(data: Itoken, id?: number): Promise<Itoken> {
    const token = await this.where({
      token_type: data.token_type,
      OR: [{ employeesId: data.employeesId }, { userId: data.userId }],
    });
    if (token)
      throw new BadRequest("nao e possivel criar o mesmo tipo de token", "");

    return await this.TokenRepository.tokens.create({ data: { ...data } });
  }
  async refresh(
    token: string
  ): Promise<{ refresh_token: string; access_token: string }> {
    try {
      const verify_token_refresh = await this.jwtService.verifyToken(
        token,
        "REFRESH"
      );
      const get_refresh_token = await this.findOne({
        userId: parseInt(verify_token_refresh.sub),
        token: token,
      });

      if (!get_refresh_token)
        throw new NotFound("token not found, please login again >", "token");

      const compare = this.DayJs.compareInDays(
        this.DayJs.dateNow(),
        get_refresh_token.expires
      );

      const IsValid =
        Math.sign(compare) === -1 ? true : compare > 0 ? false : true;

      if (IsValid) {
        await this.delete(get_refresh_token.id);
        throw new BadRequest("token error, try login again!", "token");
      }

      const { ...payload } = {
        username: verify_token_refresh.username,
        email: verify_token_refresh.email,
        id: verify_token_refresh.sub,
      };

      const new_refresh_token = await this.jwtService.signAsync(
        payload,
        "REFRESH"
      );

      await this.update(
        { token: new_refresh_token, expires: this.DayJs.addDays(7) },
        get_refresh_token.id
      );

      return {
        refresh_token: new_refresh_token,
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new BadRequest(error.message, error.stack);
    }
  }
  async findOne(params?: { token?: string; userId?: number }): Promise<Itoken> {
    return await this.TokenRepository.tokens.findFirst({
      where: { token: params.token, userId: params.userId },
    });
  }

  async delete(id: string): Promise<Itoken> {
    return await this.TokenRepository.tokens.delete({ where: { id: id } });
  }

  async update(data: Itoken, id?: string): Promise<void> {
    try {
      await this.TokenRepository.tokens.update({ data, where: { id: id } });
    } catch (error) {
      throw new BadRequest("algo deu errado ao atualizar seu token", "token");
    }
  }
  async where(
    where: Prisma.tokensWhereInput,
    types?: string,
    page?: number,
    sort?: Prisma.tokensAvgOrderByAggregateInput
  ): Promise<Itoken[] | Itoken> {
    const pageNumber = page ? page : 0;
    const { take, skip } = getPagination(pageNumber, PAGE_SIZE_DEFAULT);
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
