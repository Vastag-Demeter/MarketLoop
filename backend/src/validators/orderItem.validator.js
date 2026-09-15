import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const getOrderItemsSchema = Joi.object({
  order_id: idSchema.required(),
});

export const getOrderItemByIdSchema = Joi.object({
  id: idSchema.required(),
});

export const addOrderItemSchema = Joi.object({
  order_id: idSchema.required(),
  variant_id: idSchema.required(),
  variant_sku: stringSchema.required(),
  name: stringSchema.required(),
  unit_price: Joi.number().positive().required().messages({
    "number.base": "Unit price must be a number.",
    "number.positive": "Unit price must be positive.",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.integer": "Quantity must be a whole number.",
    "number.min": "Quantity must be at least 1.",
  }),
});
