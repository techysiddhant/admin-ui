import { CreateTenantData, CreateUserData, Credentials } from "../types";
import { api } from "./client";

// Auth Service
export const login = (credentials: Credentials) => {
  return api.post("/auth/login", credentials);
};
export const self = () => {
  return api.get("/auth/self");
};
export const logout = () => {
  return api.post("/auth/logout");
};
export const getUsers = (queryString: string) => {
  return api.get(`/users?${queryString}`);
};
export const getTenants = (queryString: string) =>
  api.get(`/tenants?${queryString}`);
export const createUser = (user: CreateUserData) => api.post(`/users`, user);
export const createTenant = (tenant: CreateTenantData) =>
  api.post(`/tenants`, tenant);
