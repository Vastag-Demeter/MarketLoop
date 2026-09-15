import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const getProductByIdSchema = Joi.object({
  id: idSchema.required(),
});

export const addProductSchema = Joi.object({
  sku: stringSchema.min(3).max(50).required(),
  name: stringSchema.min(2).max(255).required(),
  description: stringSchema.required(),
  category_id: idSchema.required(),
  vendor_id: idSchema.required(),
  base_price: Joi.number().positive().required().messages({
    "number.base": "Base price must be a number.",
    "number.positive": "Base price must be a positive value.",
  }),
});

export const updateProductSchema = Joi.object({
  id: idSchema.required(),
  sku: stringSchema.min(3).max(50),
  name: stringSchema.min(2).max(255),
  description: stringSchema,
  category_id: idSchema,
  vendor_id: idSchema,
  base_price: Joi.number().positive(),
}).min(2);

export const changeProductActivenessSchema = Joi.object({
  id: idSchema.required(),
});
