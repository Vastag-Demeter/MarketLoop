import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const toggleUserStatusSchema = Joi.object({
  user_id: idSchema.required(),
});

export const createStaffSchema = Joi.object({
  first_name: stringSchema.min(2).required(),
  last_name: stringSchema.min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role_id: idSchema.required(),
});

export const updateUserRoleSchema = Joi.object({
  user_id: idSchema.required(),
  role_id: idSchema.required(),
});
