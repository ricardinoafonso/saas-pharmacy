import { Component, FindAll, FindOne } from "@shared/dto/component";
import { EmployeesTypes } from "../dto/employees.dto";
import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@shared/infra/database/database";
import { BaseError } from "@errors/Base";
import { geratetoken, getPagination, hashPassword } from "@utils/util";
import { PAGE_SIZE_DEFAULT } from "@config/index";
import { inject, injectable } from "tsyringe";
import { Can } from "@shared/authorization/can";
import { IKafkaProducer } from "@shared/infra/container/provider/kafka/producer/kafka-producer";
import { IDateProvider } from "@shared/infra/container/provider/DataProvider/dto";

@injectable()
export class EmployeesServices
  implements
    FindOne<EmployeesTypes, number, number>,
    FindAll<
      EmployeesTypes[],
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
    @inject("DaysjsProvider") private DaysJs: IDateProvider
  ) {
    this.EmployeesRepository = prisma;
  }
  async create(data: EmployeesTypes, id?: number): Promise<EmployeesTypes> {
    await this.can.Can(data.companyId, id);
    const employees = await this.where({
      companyId: data.companyId,
      OR: [
        { name: data.name },
        { username: data.username },
        { email: data.email },
      ],
    });
    if (employees) {
      throw new BaseError(
        "um dos parametros enviados ja existe!",
        new Error().stack,
        "paramters",
        400,
        "service:employees",
        "data"
      );
    }
    const createEmployees = await this.EmployeesRepository.employees.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        address: data.address,
        password: await hashPassword(data.password),
        features: ["account:inactive"],
        companyId: data.companyId,
      },
    });

    await this.EmployeesRepository.tokens.create({
      data: {
        token: geratetoken(),
        employeesId: createEmployees.id,
        expires: this.DaysJs.addDays(1),
      },
    });

    await this.KafkaProducer.execute("SEND_MAIL", {
      email: data.email,
      username: data.username,
    });
    return createEmployees;
  }

  async findAll(
    page?: number,
    id?: number,
    sort?: Prisma.employeesAvgOrderByAggregateInput,
    search?: string
  ): Promise<EmployeesTypes[]> {
    const pageNum = page ? page : 0;
    const { take, skip } = getPagination(pageNum, PAGE_SIZE_DEFAULT);
    try {
      if (search === "undefined") {
        return await this.EmployeesRepository.employees.findMany({
          skip,
          take,
          orderBy: {
            name: "desc",
          },
          where: {
            companyId: id,
          },
        });
      }
      return await this.EmployeesRepository.employees.findMany({
        skip,
        take,
        orderBy: sort,
        where: {
          companyId: id,
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { username: { contains: search } },
          ],
        },
      });
    } catch (error) {
      throw new BaseError(
        error.message,
        error.stack,
        "database",
        400,
        "service:employees",
        ""
      );
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
    await this.can.Can(company, userId);
    return await this.EmployeesRepository.employees.deleteMany({
      where: {
        companyId: company,
        id: id,
      },
    });
  }
  async findOne(id: number, company: number): Promise<EmployeesTypes> {
    return await this.EmployeesRepository.employees.findFirst({
      where: {
        id: id,
        companyId: company,
      },
    });
  }

  async update(
    data: EmployeesTypes,
    id: number,
    userId?: number
  ): Promise<Prisma.BatchPayload> {
    await this.can.Can(id, userId);
    try {
      return await this.EmployeesRepository.employees.updateMany({
        data,
        where: {
          companyId: id,
        },
      });
    } catch (error) {
      throw new BaseError(
        error.message,
        error.stack,
        "data",
        400,
        "service:employees:update"
      );
    }
  }
}
