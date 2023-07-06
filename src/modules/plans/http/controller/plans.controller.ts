import { container } from "tsyringe";
import { PlansService } from "../../service/plans.service";
import { Response, Request } from "express";
import { IplansCreateInput } from "../../dto/plans.dto";
import { IResponse } from "@shared/DTO/response.dto";

export class plansController implements IResponse {
  async create(req: Request, res: Response): Promise<Response> {
    const data = req.body as IplansCreateInput;
    const PlansContainer = container.resolve(PlansService);
    const result = await PlansContainer.create(data);
    return res.status(201).json(result);
  }
  async findOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const PlansContainer = container.resolve(PlansService);
    const result = await PlansContainer.findOne(Number(id));

    return res.status(200).json(result);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const { page } = req.query;
    const PlansContainer = container.resolve(PlansService);
    const result = await PlansContainer.findAll(Number(page));
    return res.status(200).json(result);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data = req.body as IplansCreateInput;
    const PlansContainer = container.resolve(PlansService);

    const result = await PlansContainer.update(parseInt(id), data);
    return res.status(200).json(result);
  }
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const PlansContainer = container.resolve(PlansService);
    const result = await PlansContainer.delete(parseInt(id));

    return res.status(200).json(result)
  }
}
