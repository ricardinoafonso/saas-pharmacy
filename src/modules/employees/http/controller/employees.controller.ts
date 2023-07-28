import {
  EmployeesAuth,
  EmployeesTypes,
} from "@modules/employees/dto/employees.dto";
import { AuthEmployees } from "@modules/employees/service/employees.auth.service";
import { EmployeesServices } from "@modules/employees/service/employees.service";
import { IResponse } from "@shared/DTO/response.dto";
import { Request, Response } from "express";
import { container } from "tsyringe";

export class EmployeesController implements IResponse {
  async create(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const data = req.body as EmployeesTypes;
    const employeesContainer = container.resolve(EmployeesServices);
    const result = await employeesContainer.create(
      data,
      parseInt(`${req.user}`)
    );
    return res.status(201).json(result);
  }

  async login(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const data = req.body as EmployeesAuth;
    const EmployeesContainer = container.resolve(AuthEmployees);
    const result = await EmployeesContainer.execute(data);
    return res.status(200).json(result);
  }
  async findOne(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { id, company } = req.body;
    const EmployeesContainer = container.resolve(EmployeesServices);
    const result = await EmployeesContainer.findOne(id, company);
    return res.status(200).json(result);
  }
  async findAll(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { type, sort, page, search } = req.query;
    const { id } = req.params;
    const employeesContainer = container.resolve(EmployeesServices);
    const result = await employeesContainer.findAll(
      parseInt(`${page}`),
      parseInt(id),
      { [`${sort}`]: `${type}` },
      `${search}`
    );

    return res.status(200).json(result);
  }
  async update(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const data = req.body;
    const { id } = req.params;
    const EmployeesContainer = container.resolve(EmployeesServices);
    const result = await EmployeesContainer.update(
      data,
      parseInt(id),
      parseInt(`${req.user}`)
    );
    return res.status(200).json(result);
  }
  async delete(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { id, company } = req.body;
    const EmployeesContainer = container.resolve(EmployeesServices);
    const result = await EmployeesContainer.delete(
      id,
      company,
      parseInt(`${req.user}`)
    );
    return res.status(200).json(result);
  }
}
