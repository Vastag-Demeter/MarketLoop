import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";
import { addAddressSchema } from "./addresses.validator.js";
export const addOrderSchema = Joi.object({
  customer_email: Joi.string().email().required(),
  customer_name: Joi.string().min(3).required(),
  customer_phone: Joi.string(),

  payment_method_id: Joi.number().integer().required(),
  cart_id: Joi.number().integer().required(),
  shipping_cost: Joi.number().integer().positive().required(),
  billing_address: addAddressSchema.required(),
  shipping_address: addAddressSchema.required(),
});

export const changeOrderStatusSchema = Joi.object({
  id: idSchema.required(),
  status_id: idSchema.required(),
});

export const cancelOrderSchema = Joi.object({
  token: stringSchema.required(),
});
