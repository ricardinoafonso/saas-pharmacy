import { IAuthUser, ISignup } from "@modules/Users/dto/services.dto";
import { Auth } from "@modules/Users/service/auth.service";
import { Request, Response } from "express";
import { container } from "tsyringe";

export class Authcontroller {
  async execute (
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>>{
    const data = req.body as IAuthUser
    const authContainer = container.resolve(Auth);
    const user = await authContainer.Login(data);
    return res.status(200).json(user)
  }
  async create (
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const data = req.body as unknown as ISignup;
    const authContainer = container.resolve(Auth);
    const user = await authContainer.signup(data);
    return res.status(201).json(user);
  };
}

