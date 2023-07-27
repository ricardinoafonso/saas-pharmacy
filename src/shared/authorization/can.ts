import { BaseError } from "@errors/Base";
import { CompanyService } from "@modules/company/service/company.service";
import { EmployeesServices } from "@modules/employees/service/employees.service";
import { inject, singleton } from "tsyringe";

@singleton()
export class Can {
  constructor(
    @inject("companyService") private companyService: CompanyService,
    @inject("employeesService") private employeesService: EmployeesServices
  ) {}
  async Can(company?: number, id?: number): Promise<void> {
    try {
      const can = await this.companyService.where({ id: company, userId: id });
      if (!can) {
        const employeesCan = await this.employeesService.where({
          id: id,
          companyId: company,
        });
        if (!employeesCan) {
          throw new BaseError(
            "usuario nao tem acesso a essa propriedade",
            "",
            "nao autorizado",
            423,
            "service:product:create:name",
            "name"
          );
        }
      }
    } catch (error) {
      throw new BaseError(
        error.message,
        error.stack,
        "",
        423,
        "can",
        "database"
      );
    }
  }
}
