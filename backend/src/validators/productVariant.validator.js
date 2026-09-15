import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const getProductVariantsSchema = Joi.object({
  product_id: idSchema.required(),
});

export const addProductVariantSchema = Joi.object({
  product_id: idSchema.required(),
  variant_sku: stringSchema.min(3).required(),
  stock: Joi.number().integer().min(0).required(),
  price_modifier: Joi.number().required(),
});

export const updateProductVariantSchema = Joi.object({
  id: idSchema.required(),
  product_id: idSchema.optional(),
  variant_sku: stringSchema.min(3).optional(),
  stock: Joi.number().integer().min(0).optional(),
  price_modifier: Joi.number().optional(),
}).min(2);

export const restockSchema = Joi.object({
  id: idSchema.required(),
  stock: Joi.number().integer().positive().required().messages({
    "number.positive": "Restock amount must be a positive number.",
  }),
});
