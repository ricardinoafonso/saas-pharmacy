import { NextFunction, Request, Response } from "express";
import { BaseError } from "@errors/Base";
import { decode, verify } from "jsonwebtoken";
import { Prisma } from "@prisma/client";

const { SECRETE_JWT } = process.env;

async function Decoder(req: Request): Promise<Prisma.UserCreateInput | any> {
  const authorizatin = req.headers.authorization || "";
  const [, token] = authorizatin.split(" ");
  const { sub } = verify(token, `${SECRETE_JWT}`);
  if (sub) {
    let payload = decode(token);
    return payload;
  }
}

export function is(role: string[]) {
  const authorizatin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await Decoder(req);
      const roles = user?.features.map((role: string) => role);
      const existsRole = roles?.some((r: string) => role.includes(r));
      if (existsRole) {
        next();
      }
      throw new BaseError(
        "usuario nao authorized",
        new Error().stack,
        "authorization",
        401,
        "SERVICE:AUTHORIZATION",
        "authorization"
      );
    } catch (error: any) {
      throw new BaseError(
        error.message,
        error.stack,
        "authorization",
        401,
        "SERVICE:AUTHORIZATION",
        "authorization"
      );
    }
  };

  return authorizatin;
}
