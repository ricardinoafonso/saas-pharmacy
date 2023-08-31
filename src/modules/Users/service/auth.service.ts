import { inject, injectable } from "tsyringe";
import { IAuth, IAuthUser, ISignup, User } from "../dto/services.dto";
import { JwtService } from "@shared/services/jwtService/jwtService.service";
import { BaseError } from "@errors/Base";
import { hashPassword, passwordCompare } from "@core/utils/util";
import { IUser } from "../dto/user.dto";
import { TokenService } from "@modules/token/service/token.service";
import { IDateProvider } from "@shared/infra/container/provider/DataProvider/dto";

@injectable()
export class Auth implements IAuth {
  constructor(
    @inject("userService") private userService: User,
    @inject("jwtService") private jwtSerivce: JwtService,
    @inject("tokenService") private tokenService: TokenService,
    @inject("DaysjsProvider") private DayJs: IDateProvider
  ) {}
  async Login(
    data: IAuthUser
  ): Promise<{ access_token: string; refresh: string }> {
    try {
      const user = (await this.userService.where({
        username: data.username,
      })) as IUser;
      if (!user) {
        throw new BaseError(
          "user not found",
          new Error().stack,
          ` verifique os parametros enviados ${data}`,
          404,
          "service:auth:",
          "data"
        );
      }

      const match = await passwordCompare(data.password, user.password);
      if (!match) {
        throw new BaseError(
          "email ou password invalidos",
          new Error().stack,
          ` verifique os parametros enviados ${data}`,
          400,
          "service:auth:",
          "data"
        );
      }
      // add here service to check devices login attemps
      const { password, ...payload } = user;

      const refresh = await this.jwtSerivce.signAsync(payload, "REFRESH");
      await this.tokenService.create({
        userId: user.id,
        token: refresh,
        token_type: "REFRESH",
        expires: this.DayJs.addDays(7),
      });

      return {
        access_token: await this.jwtSerivce.signAsync(payload),
        refresh: refresh,
      };
    } catch (error) {
      throw new BaseError(
        error.message,
        error.stack,
        ``,
        404,
        "service:auth:",
        "data"
      );
    }
  }
  async signup(data: ISignup): Promise<{ message: string; data: IUser }> {
    const user: IUser = {
      password: await hashPassword(data.password),
      email: data.email,
      name: data.name,
      username: data.username,
    };
    const signup = (await this.userService.create(user)) as IUser;
    return { message: "success.", data: signup };
  }
}
