import { Prisma } from "@prisma/client";
export interface ICategories {
  create(data: Categories): Promise<Categories>;
  delete(id: number): Promise<Categories>;
  update(id: number, data: Categories): Promise<Categories>;
  findOne(id: number): Promise<Categories>;
  findAll(
    page?: number,
    sort?: Prisma.salesAvgOrderByAggregateInput,
    search?: string
  ): Promise<{
    currentPage: number;
    totalPages: number;
    result: any;
    count: number;
  }>;
}
export type Categories = {
  id?: number;
  name: string;
};
