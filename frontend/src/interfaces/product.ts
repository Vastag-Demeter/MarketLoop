import { ICategory } from "./category";

export interface Vendor {
  id: number;
  name: string;
}

export interface Image {
  id: number;
  sort_order: number;
  url: string;
}

export interface Variant {
  id: number;
  variant_sku: string;
  stock: number;
  price_modifier: number;
  attribute_values: AttributeValue[];
}

export interface SingleVariant {
  id: number;
  variant_sku: string;
  stock: number;
  price_modifier: number;
  attributeValue: AttributeValue;
}

export interface AttributeValue {
  id: number;
  value: string;
  is_active: true;
  attribute: Attribute;
}

export interface Attribute {
  id: number;
  name: string;
  is_active: boolean;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  base_price: number;
  category: ICategory;
  vendor: Vendor;
  is_active: boolean;
  images: Image[];
  variants: Variant[];
}

export interface FormData {
  id: string | number;
  name: string;
  description: string;
  category_id: string | number;
  vendor_id: string | number;
  base_price: number;
}
