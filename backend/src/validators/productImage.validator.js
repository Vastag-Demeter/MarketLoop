import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const addProductImageSchema = Joi.object({
  product_id: idSchema.required(),
  sort_order: Joi.number().integer().min(0).required(),
  url: stringSchema.uri().required().messages({
    "string.uri": "URL must be a valid link (e.g., http://...).",
  }),
});

export const updateProductImageSchema = Joi.object({
  id: idSchema.required(),
  product_id: idSchema.required(),
  sort_order: Joi.number().integer().min(0),
}).min(3);
