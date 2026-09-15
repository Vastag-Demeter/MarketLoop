import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const createTicketSchema = Joi.object({
  subject: stringSchema.max(255).required(),
  message: stringSchema.min(1).required(),
  guest_email: Joi.string().email().optional(),
});

export const replyTicketSchema = Joi.object({
  ticket_id: idSchema.required(),
  message: stringSchema.min(1).required(),
});

export const getSupportTicketByIdSchema = Joi.object({
  id: idSchema.required(),
});

export const toggleSupportTicketStatusSchema = Joi.object({
  id: idSchema.required(),
});
export const getSupportTicketByTokenSchema = Joi.object({
  token: stringSchema.required(),
});

export const replyTicketByCustomerSchema = Joi.object({
  token: stringSchema.required(),
  message: stringSchema.min(1).required(),
});
