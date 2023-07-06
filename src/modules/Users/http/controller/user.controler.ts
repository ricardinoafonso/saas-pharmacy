import { Request, Response } from "express";
import { IStatus, IUser } from "../../dto/user.dto";
import { container } from "tsyringe";
import { UserService } from "../../service/user.service";

export class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    const data = req.body as IUser;
    const userService = container.resolve(UserService);
    const user = await userService.create(data);
    return res.status(201).json(user);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const userService = container.resolve(UserService);
    const users = await userService.findAll();
    return res.status(200).json(users);
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const user = await container.resolve(UserService).findOne(parseInt(id));
    return res.status(200).json(user);
  }

  async findUsername(req: Request, res: Response): Promise<Response> {
    const { username } = req.params;
    const user = await container.resolve(UserService).findUsername(username);
    return res.status(200).json(user);
  }
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data = req.body as IUser;
    const user = container.resolve(UserService).update(parseInt(id), data);
    return res.status(200).json(user);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const user = await container.resolve(UserService).delete(parseInt(id));
    return res.status(200).json(user);
  }

  async filteredUser(req: Request, res: Response): Promise<Response> {
    const { page, search, orderBy } = req.query;
    const user = container.resolve(UserService);
    const filteredUser = await user.filteredUser(
      { page: Number(page), orderBy: { [`${orderBy}`]: "desc" } },
      String(search)
    );

    return res.status(200).json(filteredUser);
  }
  public async addFeatures(req: Request, res: Response): Promise<Response> {
    const { id, features } = req.body;
    const userContainer = container.resolve(UserService);
    const result = await userContainer.AddFeatures(parseInt(id), features);
    return res.status(201).json(result);
  }

  public async removeFeatures(req: Request, res: Response): Promise<Response> {
    const { id, features } = req.body;
    const userContainer = container.resolve(UserService);
    const result = await userContainer.removeFeatures(parseInt(id), features);
    return res.status(201).json(result);
  }

  public async statusUpdate(req: Request, res: Response): Promise<Response> {
    const { status, id } = req.params;
    console.log(req.body)
    const userContainer = container.resolve(UserService);
    const result = await userContainer.status({
      id: parseInt(id),
      status: status === "true" ? true : false,
    });
    return res.status(201).json(result);
  }
}
