import { BaseError } from "@errors/Base";
import { compare, hash } from "bcryptjs";
import crypto from "crypto";
export function getPagination(
  page: number,
  size: number
): { skip: number; take: number } {
  const take = size ? +size : 0;
  let skip = page == 0 ? 0 : page * take;
  return { skip, take };
}

export function PaginationData(
  data: any,
  page: number,
  limit: number
): { count: number; result: any; totalPages: number; currentPage: number } {
  const { count, result } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(count / limit);
  return { count, result, totalPages, currentPage };
}

export async function passwordCompare(
  pass: string,
  password?: string
): Promise<boolean> {
  return compare(`${pass}`, `${password}`);
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 8);
}

export function getPercentaged(price: number, tax: number) {
  return (price / 100) * tax;
}

export function getToken(): string {
  return crypto.randomUUID();
}

export function getData(
  model: any,
  pageNumber: number,
  take: number
): {
  currentPage: number;
  totalPages: number;
  result: any;
  count: number;
} {
  if (model[0]._all < 0 && !model[1])
    throw new BaseError("not found", new Error().stack, "getData util", 404);

  const data = PaginationData(
    { count: model[0]._all, result: model[1] },
    pageNumber,
    take
  );
  return data;
}

export function NumberValidate(id: number, types?: []): void {
  if (!types) {
    const params = types.every((type) => typeof type === "number");
    if (!params)
      throw new BaseError(
        "um dos parametros enviado esta incorreto",
        new Error().stack,
        "",
        400
      );
  } else if (!/[0-9]/.test(`${id}`)) {
    throw new BaseError("invalid paramter id", new Error().stack, "", 400);
  }                                  
}
