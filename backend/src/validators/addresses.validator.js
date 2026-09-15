import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

const optionalString = stringSchema.allow(null, "");

export const addAddressSchema = Joi.object({
  country: stringSchema.required(),
  city: stringSchema.required(),
  postal_code: stringSchema.required(),
  street: stringSchema.required(),
  house_number: stringSchema.required(),
  floor: optionalString,
  door: optionalString,
});

export const updateAddressSchema = Joi.object({
  id: idSchema.required(),
  country: stringSchema,
  city: stringSchema,
  postal_code: stringSchema,
  street: stringSchema,
  house_number: stringSchema,
  floor: optionalString,
  door: optionalString,
}).min(2);

export const deleteAddressSchema = Joi.object({
  id: idSchema.required(),
});
