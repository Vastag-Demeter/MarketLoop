import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const getVendorEmailsSchema = Joi.object({
  vendor_id: idSchema.required(),
});

export const addVendorEmailSchema = Joi.object({
  vendor_id: idSchema.required(),
  email: stringSchema.email().required().messages({
    "string.email": "Invalid email format.",
  }),
  is_primary: Joi.boolean().required().messages({
    "boolean.base": "is_primary must be a boolean (true/false).",
  }),
});

export const updateVendorEmailSchema = Joi.object({
  id: idSchema.required(),
  vendor_id: idSchema,
  email: stringSchema.email(),
  is_primary: Joi.boolean(),
}).min(2);

export const changeVendorEmailActivenessSchema = Joi.object({
  id: idSchema.required(),
});
