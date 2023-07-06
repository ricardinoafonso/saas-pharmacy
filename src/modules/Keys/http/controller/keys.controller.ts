import { KeysService } from "@modules/Keys/service/keys.service";
import { Prisma } from "@prisma/client";
import { IResponse } from "@shared/DTO/response.dto";
import { Request, Response } from "express";
import { container } from "tsyringe";


export class keysControler implements IResponse  {
  async create(req: Request, res: Response): Promise<Response> {
    const { hash, userId } = req.body;
    const data: Prisma.keyCreateManyInput = {
      hash: hash,
      status: true,
      userId: userId,
    };
    const  keyContainer = container.resolve(KeysService);
    const resul = await keyContainer.create(data);
    return res.status(201).json(resul);
  }

  geraretekey(req: Request, res: Response): Response {
    const { plansId, userId } = req.body;
    const  keyContainer = container.resolve(KeysService);
    const gerate = keyContainer.geratekey({ plansId, userId });
    return res.status(200).json(gerate);
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const  keyContainer = container.resolve(KeysService);
    const result = await keyContainer.findOne(Number(id));
    return res.status(200).json(result);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const { page } = req.query;
    const  keyContainer = container.resolve(KeysService);
    const result = await keyContainer.findAll(Number(page));
    return res.status(200).json(result);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data = req.body as Prisma.keyCreateInput;
    const  keyContainer = container.resolve(KeysService);
    const result = await keyContainer.update(Number(id), data);
    return res.status(200).json(result);
  }
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const  keyContainer = container.resolve(KeysService);
    const result = await keyContainer.delete(Number(id))
    return res.status(200).json(result);
  }
}
