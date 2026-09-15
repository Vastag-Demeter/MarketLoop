import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const getSupportTicketStatusByIdSchema = Joi.object({
  id: idSchema.required(),
});

export const addSupportTicketStatusSchema = Joi.object({
  name: stringSchema.required().messages({
    "string.empty": "Status name is mandatory.",
  }),
});

export const updateSupportTicketStatusSchema = Joi.object({
  id: idSchema.required(),
  name: stringSchema.required(),
});

export const deleteSupportTicketStatusSchema = Joi.object({
  id: idSchema.required(),
});
