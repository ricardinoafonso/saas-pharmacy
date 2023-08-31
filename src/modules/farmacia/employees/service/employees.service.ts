import { Component, FindAll, FindOne } from "@shared/dto/component";
import { EmployeesTypes } from "../dto/employees.dto";
import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@shared/infra/database/database";
import { BadRequest, NotFound } from "@errors/Base";
import {
  getToken,
  getData,
  getPagination,
  hashPassword,
} from "@core/utils/util";
import { PAGE_SIZE_DEFAULT } from "@core/config/index";
import { inject, injectable } from "tsyringe";
import { Can } from "@shared/authorization/can";
import { IKafkaProducer } from "@shared/infra/container/provider/kafka/producer/kafka-producer";
import { IDateProvider } from "@shared/infra/container/provider/DataProvider/dto";
import { Company } from "@modules/farmacia/company/dto/company.dto";

@injectable()
export class EmployeesServices
  implements
    FindOne<EmployeesTypes, number, number>,
    FindAll<
      {
        currentPage: number;
        totalPages: number;
        result: any;
        count: number;
      },
      Prisma.employeesAvgOrderByAggregateInput,
      number,
      number,
      string
    >,
    Component<EmployeesTypes>
{
  private EmployeesRepository: PrismaClient;
  constructor(
    @inject("KafkaProducer") private KafkaProducer: IKafkaProducer,
    @inject("can") private can: Can,
    @inject("DaysjsProvider") private DaysJs: IDateProvider,
    @inject("companyService") private companyService: Company
  ) {
    this.EmployeesRepository = prisma;
  }
  async create(
    data: EmployeesTypes,
    id?: number
  ): Promise<EmployeesTypes | void> {
    // check if user can create employees
    await this.can.checkIfUserAlreadyPermissionToCompleteThisAction(
      data.companyId,
      id
    );

    // find user
    const { userId } = await this.companyService.find({ id: data.companyId });

    /// check if company can create more employees on subscription type
    await this.can.check(userId, true, data.companyId);

    //
    const employeesAlready = this.where({
      companyId: data.companyId,
      OR: [
        { name: data.name },
        { username: data.username },
        { email: data.email },
      ],
    });
    if (employeesAlready) {
      throw new BadRequest(
        "um dos parametros enviados ja existe!",
        "service:employees"
      );
    }

    const token = getToken();
    const employees = await this.EmployeesRepository.employees.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        address: data.address,
        password: await hashPassword(data.password),
        features: ["account:inactive"],
        companyId: data.companyId,
        tokens: {
          create: {
            token: token,
            expires: this.DaysJs.addDays(1),
            token_type: "account:activation",
          },
        },
      },
    });

    await this.KafkaProducer.execute("SEND_MAIL", {
      email: data.email,
      username: data.username,
      token: token,
    });

    return employees;
  }

  async count(where: Prisma.employeesWhereInput): Promise<{ _all: number }> {
    return await this.EmployeesRepository.employees.count({
      where,
      select: {
        _all: true,
      },
    });
  }
  private async search(
    id: number,
    page: number,
    search?: string
  ): Promise<{
    currentPage: number;
    totalPages: number;
    result: any;
    count: number;
  }> {
    const { take, skip } = getPagination(page, PAGE_SIZE_DEFAULT);
    const transaction = await this.EmployeesRepository.$transaction([
      this.EmployeesRepository.employees.count({ where: { companyId: id } }),
      this.EmployeesRepository.employees.findMany({
        take,
        skip,
        where: {
          companyId: id,
          OR: [
            { name: { contains: search } },
            { username: { contains: search } },
            { email: { contains: search } },
            { address: { contains: search } },
          ],
        },
      }),
    ]);
    return getData(transaction, page, take);
  }
  async findAll(
    page?: number,
    id?: number,
    sort?: Prisma.employeesAvgOrderByAggregateInput,
    search?: string
  ): Promise<{
    currentPage: number;
    totalPages: number;
    result: any;
    count: number;
  }> {
    const pageNum = page ? page : 0;
    const { take, skip } = getPagination(pageNum, PAGE_SIZE_DEFAULT);
    try {
      if (search) return this.search(id, pageNum, search);
      const transaction = await this.EmployeesRepository.$transaction([
        this.EmployeesRepository.employees.count({
          where: { companyId: id },
          select: {
            _all: true,
          },
        }),
        this.EmployeesRepository.employees.findMany({
          take,
          skip,
          orderBy: sort,
          where: {
            companyId: id,
          },
        }),
      ]);
      return getData(transaction, pageNum, take);
    } catch (error) {
      throw new BadRequest(error.message, "service:employees");
    }
  }
  async where(where: Prisma.employeesWhereInput): Promise<EmployeesTypes> {
    return await this.EmployeesRepository.employees.findFirst({ where });
  }
  async delete(
    id: number,
    company: number,
    userId?: number
  ): Promise<Prisma.BatchPayload> {
    try {
      await this.can.checkIfUserAlreadyPermissionToCompleteThisAction(
        company,
        userId
      );
      const employees = await this.EmployeesRepository.employees.deleteMany({
        where: {
          companyId: company,
          id: id,
        },
      });
      return employees;
    } catch (error) {
      throw new BadRequest(error.message, "service:employees");
    }
  }
  async findOne(id: number, company: number): Promise<EmployeesTypes> {
    try {
      const employees = await this.EmployeesRepository.employees.findFirst({
        where: {
          id: id,
          companyId: company,
        },
      });
      if (!employees) throw new NotFound("employees not found!", "id:company");

      return employees;
    } catch (error) {}
    return;
  }

  async update(
    data: EmployeesTypes,
    id: number,
    userId?: number
  ): Promise<Prisma.BatchPayload> {
    await this.can.checkIfUserAlreadyPermissionToCompleteThisAction(id, userId);
    try {
      const update = await this.EmployeesRepository.employees.updateMany({
        data,
        where: {
          companyId: id,
        },
      });
      return update;
    } catch (error) {
      throw new BadRequest(error.message, "service:employees:update");
    }
  }
}
