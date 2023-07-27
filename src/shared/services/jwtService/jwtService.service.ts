import { IUser } from "@modules/Users/dto/user.dto";
import { decode, sign, verify } from "jsonwebtoken";
import { singleton } from "tsyringe";

const { SECRETE_JWT } = process.env;
@singleton()
export class JwtService {
  public async signAsync(payload: IUser): Promise<string> {
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
  public verifyToken(token: string): any {
    return verify(token, `${SECRETE_JWT}`);
  }
  public Decode(payload: string): any {
    return decode(payload);
  }
}
