import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const addCreditCardSchema = Joi.object({
  card_token: stringSchema.required(),
  last_four: Joi.string()
    .length(4)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.length": "Last four must be exactly 4 digits.",
      "string.pattern.base": "Last four must only contain numbers.",
    }),
  expiry: stringSchema.required(), // Opcionálisan: .pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/) MM/YY formátumhoz
  card_type: stringSchema.required(),
});

export const updateCreditCardSchema = Joi.object({
  id: idSchema.required(),
  card_token: stringSchema,
  last_four: Joi.string()
    .length(4)
    .pattern(/^[0-9]+$/),
  expiration_date: stringSchema,
  card_type: stringSchema,
}).min(2); // ID + legalább egy módosítandó mező

export const deleteCreditCardSchema = Joi.object({
  id: idSchema.required(),
});
