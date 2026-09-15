import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const getAttributeByIdSchema = Joi.object({
  id: idSchema.required(),
});

export const addAttributeSchema = Joi.object({
  name: stringSchema.required().messages({
    "string.empty": "Attribute name is mandatory.",
  }),
});

export const updateAttributeSchema = Joi.object({
  id: idSchema.required(),
  name: stringSchema.required(),
});

export const changeAttributeActivenessSchema = Joi.object({
  id: idSchema.required(),
});
