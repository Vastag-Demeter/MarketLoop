import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";

export const getAttributeValuesSchema = Joi.object({
  attribute_id: idSchema.required(),
});

export const getAttributeValuesByVariantIdSchema = Joi.object({
  variant_id: idSchema.required(),
});

export const addAttributeValueSchema = Joi.object({
  attribute_id: idSchema.required(),
  value: stringSchema.required().messages({
    "string.empty": "The attribute value cannot be empty.",
  }),
});

export const updateAttributeValueSchema = Joi.object({
  id: idSchema.required(),
  attribute_id: idSchema,
  value: stringSchema,
}).min(2);

export const changeAttributeValueActivenessSchema = Joi.object({
  id: idSchema.required(),
});
