import { CreateTenantData, CreateUserData, Credentials } from "../types";
import { api } from "./client";
export const AUTH_SERVICE = "/api/auth";
const CATALOG_SERVICE = "/api/catalog";
// Auth Service
export const login = (credentials: Credentials) => {
  return api.post(`${AUTH_SERVICE}/auth/login`, credentials);
};
export const self = () => {
  return api.get(`${AUTH_SERVICE}/auth/self`);
};
export const logout = () => {
  return api.post(`${AUTH_SERVICE}/auth/logout`);
};
export const getUsers = (queryString: string) => {
  return api.get(`${AUTH_SERVICE}/users?${queryString}`);
};
export const getTenants = (queryString: string) =>
  api.get(`${AUTH_SERVICE}/tenants?${queryString}`);
export const createUser = (user: CreateUserData) =>
  api.post(`${AUTH_SERVICE}/users`, user);
export const createTenant = (tenant: CreateTenantData) =>
  api.post(`${AUTH_SERVICE}/tenants`, tenant);
export const updateUser = (user: CreateUserData, id: number) =>
  api.patch(`${AUTH_SERVICE}/users/${id}`, user);

//Catalog Service

export const getCategories = () => api.get(`${CATALOG_SERVICE}/categories`);
export const getProducts = (queryString: string) => {
  return api.get(`${CATALOG_SERVICE}/products?${queryString}`);
};
export const createProduct = (formData: FormData) =>
  api.post(`${CATALOG_SERVICE}/products`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updateProduct = (productId: string, formData: FormData) =>
  api.put(`${CATALOG_SERVICE}/products/${productId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getCategory = (categoryId: string) =>
  api.get(`${CATALOG_SERVICE}/categories/${categoryId}`);
