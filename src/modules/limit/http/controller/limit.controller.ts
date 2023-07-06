import { container } from "tsyringe";
import { IlimitCreateInput } from "../../dto/limit.dto";
import { LimitService } from "../../service/limit.service";
import { Request, Response} from "express";
import { IResponse } from "@shared/DTO/response.dto";


export class limitController  implements IResponse{
  async create (req: Request, res: Response): Promise<Response>{
    const data = req.body as IlimitCreateInput;
    const limtitContainer = container.resolve(LimitService);
    const result = await limtitContainer.create(data);
    return res.status(201).json(result);
  }
  async findOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const limtitContainer = container.resolve(LimitService);
    const result = await limtitContainer.findOne(Number(id));
    return res.status(200).json(result);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const { page } = req.query;
    const limtitContainer = container.resolve(LimitService);
    const result = await limtitContainer.findAll(Number(page));
    return res.status(200).json(result);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data = req.body as IlimitCreateInput;
    const limtitContainer = container.resolve(LimitService);

    const result = await limtitContainer.update(parseInt(id), data);
    return res.status(200).json(result);
  }
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const limtitContainer = container.resolve(LimitService);
    const result = await limtitContainer.delete(parseInt(id));

    return res.status(200).json(result);
  }
}
