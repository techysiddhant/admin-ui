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
  tenant: Tenant | null;
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
export type FieldData = {
  name: string[];
  value?: string;
};

export interface PriceConfiguration {
  [key: string]: {
    priceType: "base" | "additional";
    availableOptions: string[];
  };
}
export interface Attribute {
  name: string;
  widgetType: "switch" | "radio";
  defaultValue: string;
  availableOptions: string[];
}
export interface Category {
  name: string;
  _id: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
}
export type Product = {
  _id: string;
  name: string;
  description: string;
  isPublish: boolean;
  category: Category;
  createdAt: string;
  image: string;
};
export type ImageField = {
  file: File;
};
export type CreateProductData = Product & { image: ImageField };
