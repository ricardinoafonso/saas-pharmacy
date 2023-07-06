import { container } from "tsyringe";
import { Request, Response } from "express";
import { IcompanyFind } from "../dto/company.dto";
import { Prisma } from "@prisma/client";
import { CompanyService } from "../service/company.service";

export class companyController {
  async create(req: Request, res: Response): Promise<Response> {
    const data = req.body as Prisma.companyCreateManyUserInput;
    const containerCompany = container.resolve(CompanyService);
    const result = await containerCompany.create(data);
    return res.status(201).json(result);
  }
  async findUserId(req: Request, res: Response): Promise<Response> {
    const { page, search, orderBy } = req.query as IcompanyFind;
    const { id } = req.params;
    const containerCompany = container.resolve(CompanyService);
    const result = await containerCompany.findByUserId(
      Number(id),
      page,
      { [`${orderBy}`]: "desc" },
      search
    );
    return res.status(200).json(result);
  }
  async find(req: Request, res: Response): Promise<Response> {
    const { page, search, orderBy } = req.query as IcompanyFind;
    const containerCompany = container.resolve(CompanyService);
    const result = await containerCompany.findAll(search, page, {
      [`${orderBy}`]: "desc",
    });
    return res.status(200).json(result);
  }
  async delete(req: Request, res: Response): Promise<Response> {
    const { userId, id } = req.body as Prisma.companyWhereInput;
    const containerCompany = container.resolve(CompanyService);
    const result = await containerCompany.delete({ userId, id });
    return res.status(200).json(result);
  }
  async update(req: Request, res: Response): Promise<Response> {
    const data = req.body as Prisma.companyCreateInput;
    const { id, userId } = req.params;
    const containerComapny = container.resolve(CompanyService);
    const result = await containerComapny.update(
      { id: Number(id), userId: Number(userId) },
      data
    );
    return res.status(201).json(result);
  }
}
