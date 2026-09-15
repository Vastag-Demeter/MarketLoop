import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const getEmailTypeByIdSchema = Joi.object({
  id: idSchema.required(),
});

export const addEmailTypeSchema = Joi.object({
  name: stringSchema.required().messages({
    "string.empty": "Email type name is mandatory.",
  }),
});

export const updateEmailTypeSchema = Joi.object({
  id: idSchema.required(),
  name: stringSchema.required(),
});

export const deleteEmailTypeSchema = Joi.object({
  id: idSchema.required(),
});
