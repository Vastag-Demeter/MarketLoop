import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const getOrderStatusByIdSchema = Joi.object({
  id: idSchema.required(),
});

export const addOrderStatusSchema = Joi.object({
  name: stringSchema.required().messages({
    "string.empty": "Status name is mandatory.",
  }),
  is_final: Joi.boolean().required().messages({
    "boolean.base": "is_final must be a boolean.",
  }),
});

export const updateOrderStatusSchema = Joi.object({
  id: idSchema.required(),
  name: stringSchema.required(),
});

export const deleteOrderStatusSchema = Joi.object({
  id: idSchema.required(),
});

export const changeFinalOrderStatusSchema = Joi.object({
  id: idSchema.required(),
});
