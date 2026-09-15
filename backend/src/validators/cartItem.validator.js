import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";
export const getCartItemsSchema = Joi.object({
  cart_id: Joi.number().integer().positive().required().messages({
    "number.base": "Cart ID must be an integer.",
    "number.positive": "Cart ID must be positive.",
    "any.required": "Cart ID is required.",
  }),
});

export const getCartItemByIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "ID must be a positive integer.",
    "number.positive": "ID must be positive.",
    "any.required": "Id is required.",
  }),
});

export const addCartItemSchema = Joi.object({
  cart_id: Joi.number().integer().positive().required().messages({
    "number.base": "Cart ID must be an integer.",
    "number.positive": "Cart ID must be positive.",
    "any.required": "Cart ID is required",
  }),
  variant_id: Joi.number().integer().positive().required().messages({
    "number.base": "Variant ID must be an integer.",
    "number.positive": "Variant ID must be positive.",
    "any.required": "Variant ID is required",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be an integer.",
    "number.min": "Quantity must be at least 1.",
    "any.required": "Quantity is required.",
  }),
  selected_attributes: Joi.object().min(1).required().messages({
    "object.base": "Selected attribute format is invalid.",
    "object.min": "At least 1 attribute have to be selected.",
    "any.required": "Attributes are required.",
  }),
});

export const updateCartItemSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "ID must be an integer.",
    "number.positive": "ID must be positive.",
    "any.required": "ID is required.",
  }),
  session_token: stringSchema.optional(),
  quantity: Joi.number().integer().positive().required().messages({
    "number.base": "ID must be an integer.",
    "number.positive": "ID must be positive.",
    "any.required": "ID is required.",
  }),
});

export const deleteCartItemSchema = Joi.object({
  id: idSchema.required(),
  session_token: stringSchema.optional(),
});
