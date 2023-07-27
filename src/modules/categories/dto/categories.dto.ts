import { Prisma } from "@prisma/client";
export interface ICategories {
  create(data: Categories): Promise<Categories>;
  delete(id: number): Promise<Prisma.BatchPayload>;
  update(id: number, data: Categories): Promise<Categories>;
  findOne(id: number): Promise<Categories>;
  findAll(
    page?: number,
    sort?: Prisma.salesAvgOrderByAggregateInput
  ): Promise<Categories[]>;
}
export type Categories = {
  id?: number;
  name: string;
};
