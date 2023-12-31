import { NextFunction, Request, Response } from "express";
import { NotAuthorized } from "@errors/Base";
import { inject, injectable } from "tsyringe";
import { User } from "@modules/Users/dto/services.dto";
import { JwtService } from "@shared/services/jwtService/jwtService.service";
import { IUser } from "@modules/Users/dto/user.dto";
import { EmployeesServices } from "@modules/farmacia/employees/service/employees.service";
import { EmployeesTypes } from "@modules/farmacia/employees/dto/employees.dto";

@injectable()
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
          throw new NotAuthorized(
            "user without subscription, or deactivated",
            "Renew your Subscription, or contact support!"
          );
        }
      }
      req.user = this.User.id;
      const { password, ...payload } = this.User;
      return payload;
    }
  }
  public is(role?: string[]) {
    const authorization = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const user = await this.Decoder(req);
        if (!role) return next();
        const roles = user?.features.map((r: string) => r);
        const checkUserHaveRoles = roles.some((r: string) => role.includes(r));

        if (checkUserHaveRoles) {
          return next();
        }
        throw new NotAuthorized(
          "non-authorized user, you do not have permission to complete this action!",
          "authorization"
        );
      } catch (error: any) {
        if (error.stack.includes("TokenExpiredError")) {
          next(
            new NotAuthorized(
              "Token expirado por favor inicia sessao novamente",
              ""
            )
          );
        }
        next(new NotAuthorized(error.message, error.stack));
      }
    };

    return authorization;
  }
}
