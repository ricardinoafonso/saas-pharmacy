import { container } from "tsyringe";
import { ProductTypes } from "../../dto/product.td";
import { ProductService } from "@modules/farmacia/product/service/product.service";
import { Request, Response } from "express";
import { IResponse } from "@shared/DTO/response.dto";

export class productController implements IResponse {
  async create(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const data = req.body as ProductTypes;
    const productServiceContainer = container.resolve(ProductService);
    const result = await productServiceContainer.create(data,parseInt(`${req.user}`));
    return res.status(201).json(result);
  }
  async findOne(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { id, company } = req.params;
    const productServiceContainer = container.resolve(ProductService);
    const result = await productServiceContainer.findOne(
      parseInt(id),
      parseInt(company)
    );

    return res.status(200).json(result);
  }

  async findAll(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { page, search, sort, type } = req.query;
    const { id } = req.params;
    const ProductContainer = container.resolve(ProductService);
    const result = await ProductContainer.findAll(
      parseInt(`${page}`),
      parseInt(id),
      {
        [`${sort}`]: `${type}`,
      },
      `${search}`
    );

    return res.status(200).json(result);
  }

  async delete(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { id, company } = req.body;
    const productContainer = container.resolve(ProductService);
    const result = await productContainer.delete(
      parseInt(id),
      parseInt(company),
      parseInt(`${req.user}`)
    );
    return res.status(200).json(result);
  }
  async update(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const data = req.body as ProductTypes;
    const productServiceContainer = container.resolve(ProductService);
    const result = await productServiceContainer.update(
      data,
      {
        companyId: data.companyId,
        id: data.id,
      },
      parseInt(`${req.user}`)
    );
    return res.status(201).json(result);
  }
}
