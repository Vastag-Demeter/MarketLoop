import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const getRoleByIdSchema = Joi.object({
  id: idSchema.required(),
});

export const addRoleSchema = Joi.object({
  name: stringSchema.required().messages({
    "string.empty": "Role name is required.",
  }),
});

export const updateRoleSchema = Joi.object({
  id: idSchema.required(),
  name: stringSchema.required(),
});

export const deleteRoleSchema = Joi.object({
  id: idSchema.required(),
});
