import { injectable, inject } from "tsyringe";
import { EmployeesAuth } from "../dto/employees.dto";
import { EmployeesServices } from "./employees.service";
import { JwtService } from "@shared/services/jwtService/jwtService.service";
import { TokenService } from "@modules/token/service/token.service";
import { IDateProvider } from "@shared/infra/container/provider/DataProvider/dto";
import { BaseError } from "@errors/Base";
import { passwordCompare } from "@utils/util";
import { CompanyService } from "@modules/company/service/company.service";
@injectable()
export class AuthEmployees {
  private company: any;
  constructor(
    @inject("companyService") private companyService: CompanyService,
    @inject("employeesService") private employeesService: EmployeesServices,
    @inject("jwtService") private jwtSerivce: JwtService,
    @inject("tokenService") private tokenService: TokenService,
    @inject("DaysjsProvider") private DayJs: IDateProvider
  ) {}
  async execute(
    Data: EmployeesAuth
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.employeesService.where({ username: Data.username });
    if (!user)
      throw new BaseError(
        "user not found",
        new Error().stack,
        "username",
        404,
        "service:auth",
        "username"
      );
    const match = await passwordCompare(Data.password, user.password);

    if (!match)
      throw new BaseError(
        "email or password invalid !",
        new Error().stack,
        "username or password",
        423,
        "service:auth"
      );

    this.company = await this.companyService.findOne(user.companyId);
    const { status } = this.company.User;
    if (!status)
      throw new BaseError(
        "conta desativada ou sem subscrisao !",
        new Error().stack,
        "por favor contacte o suporte por favor!",
        423,
        "service:auth"
      );
    const { password, ...payload } = user;
    const refresh_token = await this.jwtSerivce.signAsync(payload, "REFRESH");
    await this.tokenService.create({
      token: refresh_token,
      expires: this.DayJs.addDays(7),
      employeesId: user.id,
    });

    return {
      access_token: await this.jwtSerivce.signAsync(payload),
      refresh_token: refresh_token,
    };
  }
}
