import {
  Categories,
} from "@modules/categories/dto/categories.dto";
import { container } from "tsyringe";
import { CategoriesServices } from "../../service/categories.service";
import { Response, Request } from "express";
import { IResponse } from "@shared/DTO/response.dto";
export class CategoriesController implements IResponse {
  async create(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const data = req.body as Categories;
    const containerCategories = container.resolve(CategoriesServices);
    const result = await containerCategories.create(data);
    return res.status(201).json(result);
  }
  async delete(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { id } = req.body;
    const containerCategories = container.resolve(CategoriesServices);
    const result = await containerCategories.delete(parseInt(id));
    return res.status(200).json(result);
  }
  async update(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { id } = req.params;
    const data = req.body as Categories;
    const containerCategories = container.resolve(CategoriesServices);
    const result = await containerCategories.update(parseInt(id), data);
    return res.status(200).json(result);
  }
 async findAll(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { page, sort , desc } = req.query
    const containerCategories = container.resolve(CategoriesServices)
    const result = await containerCategories.findAll( Number(page), { [`${sort}`]: `${desc}`})
    return res.status(200).json(result)
  }
  findOne(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    throw new Error("Method not implemented.");
  }
}
