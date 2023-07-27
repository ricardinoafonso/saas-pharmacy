export interface Component<T> {
  create(
    data: T,
    id?: number,
    params?: { company?: number; userId?: number }
  ): Promise<T>;
}
export interface FindAll<T, SORT, ID, PAGE, SEARCH> {
  findAll(page?: PAGE, id?: ID, sort?: SORT, search?: SEARCH): Promise<T>;
}

export interface FindOne<T, ID, Company> {
  findOne(id: ID, company: Company): Promise<T>;
}
