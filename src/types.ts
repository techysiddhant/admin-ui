export type Credentials = {
  email: string;
  password: string;
};
export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};
export type Tenant = {
  id: number;
  name: string;
  address: string;
};
export type CreateUserData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  tenantId: number;
};
export type CreateTenantData = {
  name: string;
  address: string;
};
