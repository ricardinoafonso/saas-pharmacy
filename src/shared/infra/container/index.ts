import { container } from "tsyringe";
import "@shared/infra/container/provider/index";
import { UserService } from "@modules/Users/service/user.service";
import { IAuth, User } from "@modules/Users/dto/services.dto";
import { Company } from "@modules/farmacia/company/dto/company.dto";
import { CompanyService } from "@modules/farmacia/company/service/company.service";
import { Keys } from "@modules/Keys/dto/keys.dto";
import { KeysService } from "@modules/Keys/service/keys.service";
import { Plans } from "@modules/plans/dto/plans.dto";
import { PlansService } from "@modules/plans/service/plans.service";
import { Limit } from "@modules/limit/dto/limit.dto";
import { LimitService } from "@modules/limit/service/limit.service";
import { Authorization } from "@shared/authorization";
import { JwtService } from "@shared/services/jwtService/jwtService.service";
import { Auth } from "@modules/Users/service/auth.service";
import { ProductService } from "@modules/farmacia/product/service/product.service";
import { SalesDto } from "@modules/farmacia/sales/dto/sales.dto";
import { SalesServices } from "@modules/farmacia/sales/service/sales.service";
import { ICategories } from "../../../modules/farmacia/categories/dto/categories.dto";
import { CategoriesServices } from "@modules/farmacia/categories/service/categories.service";
import { Can } from "@shared/authorization/can";
import { EmployeesServices } from "@modules/farmacia/employees/service/employees.service";
import { IKafkaProducer, Producers } from "./provider/kafka/producer/kafka-producer";
import { TokenService } from "@modules/token/service/token.service";
import { AuthEmployees } from "@modules/farmacia/employees/service/employees.auth.service";
import { ISubscription } from '@modules/subscription/dto/subscription.dto';
import { subscriptionService } from "@modules/subscription/service/subscription.service";
import { CompanyValidation } from "@modules/farmacia/company/validation/validation";

container.register<IAuth>("auth", Auth);
container.registerSingleton<User>("userService", UserService);
container.registerSingleton<ISubscription>('subscriptionService',subscriptionService)
container.register<Plans>("plansService", PlansService);
container.registerSingleton<Limit>("limitService", LimitService);
container.registerSingleton<Company>("companyService", CompanyService);
container.registerSingleton("employeesService", EmployeesServices);
container.registerSingleton("authorization", Authorization);
container.registerSingleton("jwtService", JwtService);
container.register<Keys>("keysService", KeysService);
container.register('companyValidation', CompanyValidation)
container.registerSingleton("productService", ProductService);
container.register<SalesDto>("salesService", SalesServices);
container.register<ICategories>("categoriesService", CategoriesServices);

container.registerSingleton<IKafkaProducer>("KafkaProducer", Producers);
container.registerSingleton("can", Can);
container.register('tokenService', TokenService)
container.register('authEmployees', AuthEmployees)