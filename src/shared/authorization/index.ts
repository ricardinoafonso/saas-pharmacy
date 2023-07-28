import { NextFunction, Request, Response } from "express";
import { BaseError } from "@errors/Base";
import { inject, singleton } from "tsyringe";
import { User } from "@modules/Users/dto/services.dto";
import { JwtService } from "@shared/services/jwtService/jwtService.service";
import { IUser } from "@modules/Users/dto/user.dto";
import { EmployeesServices } from "@modules/employees/service/employees.service";
import { EmployeesTypes } from "@modules/employees/dto/employees.dto";

@singleton()
export class Authorization {
  private User: User | EmployeesTypes;
  constructor(
    @inject("userService") private userService: User,
    @inject("jwtService") private jwtService: JwtService,
    @inject("employeesService") private employeesService: EmployeesServices
  ) {}
  private async Decoder(req: Request): Promise<IUser | any> {
    const Authorizations = req.headers.authorization || "";
    const [, token] = Authorizations.split(" ");
    const { sub: id } = this.jwtService.verifyToken(token);
    if (id) {
      this.User = await this.userService.findOne(parseInt(id));
      if (!this.User) {
        this.User = await this.employeesService.where({ id: parseInt(id) });
        if (!this.User) {
          throw new BaseError(
            "usuario sem subscricao,ou desactivado",
            new Error().stack,
            "Renova sua Subscrisao, ou contacte o suporte !",
            423,
            "auth:middleware:user",
            "Features"
          );
        }
      }
      const { signed } = req.signedCookies;
      req.user = this.User.id;
      const { password, ...payload } = this.User;
      return payload;
    }
  }
  public is(role: string[]) {
    const authorization = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const user = await this.Decoder(req);
        const roles = user?.features.map((r: string) => r);
        const checkUserHaveRoles = roles.some((r: string) => role.includes(r));

        if (checkUserHaveRoles) {
          return next();
        }
        throw new BaseError(
          "usuario nao authorized , nao tens permissao completar essa acao!",
          new Error().stack,
          "authorization",
          401,
          "shared:authorization",
          "authorization"
        );
      } catch (error: any) {
        if (error.stack.includes("TokenExpiredError")) {
          next(
            new BaseError(
              "Token expirado por favor inicia sessao novamente",
              "",
              "authorization",
              401,
              "shared:authorization",
              "authorization"
            )
          );
        }
        next(
          new BaseError(
            error.message,
            error.stack,
            "authorization",
            401,
            "shared:authorization",
            "authorization"
          )
        );
      }
    };

    return authorization;
  }
}
