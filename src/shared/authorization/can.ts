import { BaseError } from "@errors/Base";
import { CompanyService } from "@modules/farmacia/company/service/company.service";
import { EmployeesServices } from "@modules/farmacia/employees/service/employees.service";
import { container, inject, injectable } from "tsyringe";
import { Limit } from "../../modules/limit/dto/limit.dto";
import { ISubscription } from "@modules/subscription/dto/subscription.dto";

@injectable()
export class Can {
  constructor(
    @inject("subscriptionService") private subscriptionService: ISubscription,
    @inject("limitService") private limit: Limit
  ) {}
  async check(
    userId: number,
    type_action?: boolean,
    companyId?: number
  ): Promise<void> {
    const companyService = container.resolve(CompanyService);
    const employeesService = container.resolve(EmployeesServices);
    const subscription = await this.subscriptionService.findOne({
      userId: userId,
    });
    if (!subscription)
      throw new BaseError(
        " por favor subscreva em plano!",
        new Error().stack,
        "seu plano nao foi encontrado",
        404
      );

    const { plansId, status } = subscription;
    if (!status)
      throw new BaseError(
        " sua conta foi desativada, por favor atualize a pagina",
        new Error().stack,
        "por favor renove sua subscrisao",
        400
      );

    const { company_number, employers } = await this.limit.findWhere({
      plansId: plansId,
    });

    if (type_action) {
      const { _all } = await employeesService.count({ companyId: companyId });
      if (_all >= employers)
        throw new BaseError(
          "nao podes criar mais funcionarios, atingiste o limite.",
          new Error().stack,
          "atualiza sua subscrisao",
          400
        );
    } else {
      const { _all } = await companyService.count({ userId: userId });

      if (_all >= company_number)
        throw new BaseError(
          "nao podes criar mais companias, atingiste o limite.",
          new Error().stack,
          "atualiza sua subscrisao",
          400
        );
    }
  }
  async checkIfUserAlreadyPermissionToCompleteThisAction(company: number, id?: number): Promise<void> {
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
