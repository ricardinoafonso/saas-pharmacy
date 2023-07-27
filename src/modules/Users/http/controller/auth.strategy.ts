import { IAuthUser, ISignup } from "@modules/Users/dto/services.dto";
import { Auth } from "@modules/Users/service/auth.service";
import { Request, Response } from "express";
import { Strategy } from "passport-local";
import { container } from "tsyringe";
import { BaseError } from "@errors/Base";
const authContainer = container.resolve(Auth);
export const StrategyLocal = new Strategy(
  { usernameField: "username", passwordField: "password" },
  async (username, password, done) => {
    try {
      const data: IAuthUser = {
        username: username,
        password: password,
      };
      const user = await authContainer.Login(data);
      return done(null, user, { message: "login success" });
    } catch (error: any) {
      throw new BaseError(
        error.message,
        error.stack,
        "username or password",
        423,
        "",
        "data"
      );
    }
  }
);
export const signup = async (
  req: Request,
  res: Response<any, Record<string, any>>
): Promise<Response<any, Record<string, any>>> => {
  const data = req.body as unknown as ISignup;
  const authContainer = container.resolve(Auth);
  const user = await authContainer.signup(data);
  return res.status(201).json(user);
};
/** 
    const data = req.body as unknown as IAuthUser;
    const authcontainer = container.resolve(Auth);
    const user = await authcontainer.Login(data);
    return res.status(200).json(user);
  }
  
}
*/
