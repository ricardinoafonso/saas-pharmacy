import { BaseError } from "@errors/Base";
import { CompanyService } from "@modules/company/service/company.service";
import { EmployeesServices } from "@modules/employees/service/employees.service";
import { container, injectable } from 'tsyringe';

@injectable()
export class Can {
  async Can(company?: number, id?: number): Promise<void> {
    const companyService = container.resolve(CompanyService);
    const employeesService = container.resolve(EmployeesServices);
    try {
      const can = await companyService.where({ id: company, userId: id });
      if (!can) {
        const employeesCan = await employeesService.where({
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
