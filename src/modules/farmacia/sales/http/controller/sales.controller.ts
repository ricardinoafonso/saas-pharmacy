import { ISales, SalesCreate } from "@modules/farmacia/sales/dto/sales.dto";
import { SalesServices } from "@modules/farmacia/sales/service/sales.service";
import { IResponse } from "@shared/DTO/response.dto";
import { Request, Response } from "express";
import { container } from "tsyringe";

export class salesController implements IResponse {
  async create(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const data = req.body as SalesCreate;
    const containerSales = container.resolve(SalesServices);
    const result = await containerSales.create(data, parseInt(`${req.user}`));
    return res.status(201).json(result);
  }
  async findOne(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { id, companyId } = req.params;
    const containerSales = container.resolve(SalesServices);
    const result = await containerSales.findOne({
      id: parseInt(id),
      companyId: parseInt(companyId),
    });
    return res.status(200).json(result);
  }
  async findAll(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { companyId } = req.params;
    const { page, sort, employees, start, end } = req.query;
    const SalesContainer = container.resolve(SalesServices);
    const result = await SalesContainer.findAll(
      parseInt(`${page}`),
      parseInt(companyId),
      { [`${sort}`]: "desc" },
      parseInt(`${employees}`),
      {
        start: new Date(`${start}`).setHours(0, 0, 0, 0),
        end: new Date(`${end}`).setHours(0, 0, 0, 0),
      }
    );
    return res.status(200).json(result);
  }
  async update(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const data = req.body as ISales;
    const SalesContainer = container.resolve(SalesServices);
    const result = await SalesContainer.update(data, parseInt(`${req.user}`));
    return res.status(200).json(result);
  }
  async delete(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { id, companyId } = req.params;
    const SalesContainer = container.resolve(SalesServices);
    const result = await SalesContainer.delete({
      id: parseInt(id),
      companyId: parseInt(companyId),
      userId: parseInt(`${req.user}`),
    });

    return res.status(200).json(result);
  }
}
