import { BadRequest, NotAuthorized, NotFound } from "@errors/Base";
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
      throw new NotFound(
        "please subscribe to plan!",
        "your subscription is deactivated."
      );

    const { plansId, status } = subscription;
    if (!status)
      throw new BadRequest(
        "your account has been deactivated, please refresh the page",
        "please renew your subscription"
      );

    const { company_number, employers } = await this.limit.findWhere({
      plansId: plansId,
    });

    if (type_action) {
      const { _all } = await employeesService.count({ companyId: companyId });
      if (_all >= employers)
        throw new BadRequest(
          "You cannot create more employees, you have reached the limit.",
          "update your subscription"
        );
    } else {
      const { _all } = await companyService.count({ userId: userId });

      if (_all >= company_number)
        throw new BadRequest(
          "You cannot create more companies, you have reached the limit.",
          "update your subscription"
        );
    }
  }
  async checkIfUserAlreadyPermissionToCompleteThisAction(
    company: number,
    id?: number
  ): Promise<void> {
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
          throw new NotAuthorized(
            "user does not have access to this property",
            "service:product:create:name"
          );
        }
      }
    } catch (error) {
      throw new NotAuthorized("user not authorized", error.stack);
    }
  }
}
