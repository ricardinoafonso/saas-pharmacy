import { compare, hash } from "bcryptjs";
import crypto from 'crypto';
export function getPagination(
  page: number,
  size: number
): { skip: number; take: number } {
  const take = size ? +size : 0;
  let skip = page == 0 ? 0 : page * take;
  return { skip, take };
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

export function geratetoken(): string {
  return crypto.randomUUID();
}
