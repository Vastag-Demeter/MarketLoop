import Joi from "joi";
import { stringSchema } from "./base.validators.js";

export const editProfileSchema = Joi.object({
  firstName: stringSchema.allow(null, ""),
  lastName: stringSchema.allow(null, ""),
}).min(1);

export const activateAccountSchema = Joi.object({
  email: stringSchema.email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "Email is required.",
  }),
  code: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .allow(null, "")
    .messages({
      "string.length": "The code must be exactly 6 digits.",
      "string.pattern.base": "The code must contain only numbers.",
    }),
});

export const loginSchema = Joi.object({
  email: stringSchema.email().required().messages({
    "string.email": "Email must be a valid email address.",
  }),
  password: stringSchema.required(),
});

export const signupSchema = Joi.object({
  firstName: stringSchema.min(2).max(50).required(),
  lastName: stringSchema.min(2).max(50).required(),
  email: stringSchema.email().required(),
  password: stringSchema.min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
  }),
});

export const verifyEmailSchema = Joi.object({
  token: stringSchema.hex().length(64).required().messages({
    "string.length": "Invalid token format.",
  }),
});

export const sendNewTokenSchema = Joi.object({
  email: stringSchema.email().required(),
});
