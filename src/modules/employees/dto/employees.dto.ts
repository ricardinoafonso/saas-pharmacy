export type EmployeesTypes = {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  address?: string;
  companyId?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type EmployeesAuth = {
  password: string;
  username: string;
};
