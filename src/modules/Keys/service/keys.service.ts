import { Prisma, PrismaClient } from "@prisma/client";
import { Keys, IkeysDto } from "../dto/keys.dto";
import { prisma } from "@shared/infra/database/database";
import { injectable } from "tsyringe";
import { getPagination } from "@utils/util";
import crypto from "crypto";

@injectable()
export class KeysService implements Keys {
  private algoritm: string = process.env.algoritm;
  private secretKey: string = `${process.env.secretKey_keys}`;
  private readonly IKeysRepository: PrismaClient;
  constructor() {
    this.IKeysRepository = prisma;
  }
  async findAll(page?: number): Promise<Prisma.keyCreateManyInput[]> {
    const pageNumber = page ? page : 0;
    const { take, skip } = getPagination(pageNumber, 20);
    return await this.IKeysRepository.key.findMany({
      skip,
      take,
      orderBy: {
        id: "desc",
      },
    });
  }
  async create(
    data: Prisma.keyCreateManyInput
  ): Promise<Prisma.keyCreateManyInput> {
    return await this.IKeysRepository.key.create({ data });
  }
  async findOne(id?: number): Promise<IkeysDto | undefined> {
    return (await this.IKeysRepository.key.findFirst({
      where: {
        id,
      },
    })) as IkeysDto;
  }
  async delete(id?: number): Promise<Prisma.keyCreateManyInput> {
    return await this.IKeysRepository.key.delete({ where: { id } });
  }
  geratekey(data: { plansId: number; userId: number }): string {
    const { iv, content } = this.encrypt(data);
    return `${iv}:${content}`;
  }
  encrypt(data: { plansId: number; userId: number }): {
    iv: string;
    content: string;
  } {
    const iv = crypto.randomBytes(16);
    const decifher = crypto.createCipheriv(this.algoritm, this.secretKey, iv);
    const encrypted = Buffer.concat([
      decifher.update(`${data}`),
      decifher.final(),
    ]);
    return {
      iv: iv.toString("hex"),
      content: encrypted.toString("hex"),
    };
  }
  descrypt(data: { iv: string; content: string }): string {
    const decrypted = crypto.createDecipheriv(
      this.algoritm,
      this.secretKey,
      Buffer.from(data.iv, "hex")
    );
    const content = Buffer.concat([
      decrypted.update(Buffer.from(data.content, "hex")),
      decrypted.final(),
    ]);
    return content.toString();
  }
  async update(
    id: number,
    data: Prisma.keyCreateInput
  ): Promise<Prisma.keyCreateManyInput> {
    return await this.IKeysRepository.key.update({
      data,
      where: {
        id,
      },
    });
  }
}
