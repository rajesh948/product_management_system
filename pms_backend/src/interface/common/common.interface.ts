export interface JwtSetUserInterface {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  role: string;
  cart?: { id: number; userId: number };
  permissions: string[] | undefined;
}

export interface QueryStringInterface {
  sort?: string;
  search?: string;
  where?: string;
  page?: string;
  limit?: string;
}

export interface RolePermissionInterface {
  roleId: number;
  permissions: Array<{ id: number }>;
}
export interface UserPermissionInterface {
  userId: number;
  permissions: Array<{ id: number }>;
}

export interface CategoryProductInterface {
  categoryId: number;
  products: Array<{ id: number }>;
}
