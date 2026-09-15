import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const getPaymentMethodByIdSchema = Joi.object({
  id: idSchema.required(),
});

export const addPaymentMethodSchema = Joi.object({
  name: stringSchema.required().messages({
    "string.empty": "Payment method name is mandatory.",
  }),
});

export const updatePaymentMethodSchema = Joi.object({
  id: idSchema.required(),
  name: stringSchema.required(),
});

export const changePaymentMethodActivenessSchema = Joi.object({
  id: idSchema.required(),
});
