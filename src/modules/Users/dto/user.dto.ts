export type IUser = {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  endereco?: string;
  features?: string[];
  status?: boolean;
  craeteAt?: Date;
  updatedAt?: Date;
}

export type IStatus = {
  id: number;
  status?: boolean;
}
