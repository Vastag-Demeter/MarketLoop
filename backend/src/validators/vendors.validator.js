import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const getVendorByIdSchema = Joi.object({
  id: idSchema.required(),
});

export const addVendorSchema = Joi.object({
  name: stringSchema.required().messages({
    "string.empty": "Vendor name cannot be empty.",
  }),
});

export const updateVendorSchema = Joi.object({
  id: idSchema.required(),
  name: stringSchema.required(),
});

export const changeVendorActivenessSchema = Joi.object({
  id: idSchema.required(),
});
