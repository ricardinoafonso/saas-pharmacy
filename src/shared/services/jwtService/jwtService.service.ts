import { IUser } from "@modules/Users/dto/user.dto";
import { decode, sign, verify } from "jsonwebtoken";
import { singleton } from "tsyringe";
import { EmployeesTypes } from "@modules/farmacia/employees/dto/employees.dto";

const { SECRETE_JWT, JWT_REFRESH_KEY } = process.env;
@singleton()
export class JwtService {
  public async signAsync(
    payload: IUser | EmployeesTypes,
    type_token?: string
  ): Promise<string> {
    if (type_token === "REFRESH") {
      return sign(
        {
          username: payload.username,
          name: payload.name,
          email: payload.email,
        },
        `${JWT_REFRESH_KEY}`,
        {
          expiresIn: "7days",
          algorithm: "HS256",
          subject: `${payload.id}`,
        }
      );
    }
    return sign(
      {
        username: payload.username,
        name: payload.name,
        email: payload.email,
      },
      `${SECRETE_JWT}`,
      {
        expiresIn: "59m",
        algorithm: "HS256",
        subject: `${payload.id}`,
      }
    );
  }
  public verifyToken(token: string, types_verify?: string): any {
    if (types_verify === "REFRESH") return verify(token, JWT_REFRESH_KEY);
    return verify(token, SECRETE_JWT);
  }

  public Decode(payload: string): any {
    return decode(payload);
  }
}
