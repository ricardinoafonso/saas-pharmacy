import { container } from "tsyringe";
import { UserService } from "@modules/Users/service/user.service";
import { IuserService } from "@modules/Users/dto/services.dto";
import { IcompanyService } from "@modules/company/dto/company.dto";
import { CompanyService } from "@modules/company/service/company.service";
import { Ikeys } from "@modules/Keys/dto/keys.dto";
import { KeysService } from "@modules/Keys/service/keys.service";
import { IplansService } from "@modules/plans/dto/plans.dto";
import { PlansService } from "@modules/plans/service/plans.service";
import { Ilimit } from "@modules/limit/dto/limit.dto";
import { LimitService } from "@modules/limit/service/limit.service";

container.registerSingleton<IuserService>("userService", UserService);
container.register<IcompanyService>("companyService", CompanyService);
container.register<Ikeys>("keysService", KeysService);
container.register<IplansService>("plansService", PlansService);
container.register<Ilimit>("limitService", LimitService);
