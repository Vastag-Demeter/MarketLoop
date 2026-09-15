import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const permissionRoleSchema = Joi.object({
  permission_id: idSchema.required(),
  role_id: idSchema.required(),
});
