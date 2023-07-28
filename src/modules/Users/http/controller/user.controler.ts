import { Request, Response } from "express";
import { IUser } from "../../dto/user.dto";
import { container } from "tsyringe";
import { UserService } from "../../service/user.service";
import { IResponse } from "@shared/DTO/response.dto";

export class UserController implements IResponse {
  async create(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const data = req.body as IUser;
    const userService = container.resolve(UserService);
    const user = await userService.create(data);
    return res.status(201).json(user);
  }

  
  async findAll(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const userService = container.resolve(UserService);
    const users = await userService.findAll();
    return res.status(200).json(users);
  }

  async findOne(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { id } = req.params;
    const user = await container.resolve(UserService).findOne(parseInt(id));
    return res.status(200).json(user);
  }

  async findUsername(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { username } = req.params;
    const user = await container.resolve(UserService).findUsername(username);
    return res.status(200).json(user);
  }
  async update(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { id } = req.params;
    const data = req.body as IUser;
    const user = container.resolve(UserService).update(parseInt(id), data);
    return res.status(200).json(user);
  }

  async delete(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { id } = req.params;
    const user = await container.resolve(UserService).delete(parseInt(id));
    return res.status(200).json(user);
  }

  async filteredUser(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { page, search, orderBy } = req.query;
    const user = container.resolve(UserService);
    const filteredUser = await user.filteredUser(
      { page: Number(page), orderBy: { [`${orderBy}`]: "desc" } },
      String(search)
    );

    return res.status(200).json(filteredUser);
  }
  public async addFeatures(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { id, features } = req.body;
    const userContainer = container.resolve(UserService);
    const result = await userContainer.AddFeatures(parseInt(id), features);
    return res.status(201).json(result);
  }

  public async removeFeatures(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { id, features } = req.body;
    const userContainer = container.resolve(UserService);
    const result = await userContainer.removeFeatures(parseInt(id), features);
    return res.status(201).json(result);
  }

  public async statusUpdate(
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> {
    const { status, id } = req.params;
    const userContainer = container.resolve(UserService);
    const result = await userContainer.status({
      id: parseInt(id),
      status: status === "true" ? true : false,
    });
    return res.status(201).json(result);
  }
}
