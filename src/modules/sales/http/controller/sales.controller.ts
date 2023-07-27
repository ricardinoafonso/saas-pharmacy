import { SalesCreate } from "@modules/sales/dto/sales.dto";
import { SalesServices } from "@modules/sales/service/sales.service";
import { IResponse } from "@shared/DTO/response.dto";
import { Request, Response } from "express";
import { container } from 'tsyringe';


export class salesController  implements IResponse{
  async  create(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
       const data = req.body as SalesCreate
       const containerSales = container.resolve(SalesServices)
       const result = await containerSales.create(data)
       return res.status(201).json(result)
    }
    findOne(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
        throw new Error("Method not implemented.");
    }
    findAll(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
        throw new Error("Method not implemented.");
    }
    update(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
        throw new Error("Method not implemented.");
    }
    delete(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
        throw new Error("Method not implemented.");
    }

}