import { Request, Response } from "express";
export interface IResponse {
  create(req: Request, res: Response): Promise<Response>;
  findOne(req: Request, res: Response): Promise<Response>;
  findAll(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
}
