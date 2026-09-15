import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const getCartSchema = Joi.object({
  session_token: stringSchema.optional(),
});

export const createCartSchema = Joi.object({
  session_token: stringSchema.when("user_id", {
    is: Joi.not().exist(),
    then: Joi.required(),
  }),
});

export const updateCartSchema = Joi.object({
  session_token: stringSchema.required().messages({
    "any.required": "Session token is required.",
  }),
});

export const deleteCartSchema = Joi.object({
  id: idSchema.required(),
  session_token: stringSchema.optional(),
});
