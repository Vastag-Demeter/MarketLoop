import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const addPhoneNumberSchema = Joi.object({
  phone_number: stringSchema.required(),
});

export const updatePhoneNumberSchema = Joi.object({
  id: idSchema.required(),
  phone_number: stringSchema.required(),
});

export const deletePhoneNumberSchema = Joi.object({
  id: idSchema.required(),
});
