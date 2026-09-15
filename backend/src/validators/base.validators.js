import Joi from "joi";
export const idSchema = Joi.number().integer().positive().messages({
  "number.base": "ID must be a number",
  "number.integer": "ID must be an integer.",
  "number.positive": "ID must be positive.",
  "any.required": "ID is required",
});

export const stringSchema = Joi.string().messages({
  "string.base": "Must be a string",
  "string.empty": "Cannot be empty.",
  "any.required": "Is required.",
});
