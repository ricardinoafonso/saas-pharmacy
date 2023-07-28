import { Itoken } from "@modules/token/dto/dto";
import { TokenService } from "@modules/token/service/token.service";
import { Request, Response } from "express";
import { container } from "tsyringe";

export class TokenController {
  async execute(_req: Request, _res: Response): Promise<Response> {
    const token = _req.body as Itoken;
    const TokenContainer = container.resolve(TokenService);
    const result = await TokenContainer.create(token);
    return _res.status(201).json(result);
  }
  async refresh_token(_req: Request, _res: Response): Promise<Response> {
    const { token } = _req.body;
    const TokenContainer = container.resolve(TokenService);
    const result = await TokenContainer.refresh(token);
    return _res.status(200).json(result);
  }
}
