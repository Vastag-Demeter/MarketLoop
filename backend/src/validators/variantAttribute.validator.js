import Joi from "joi";
import { idSchema } from "./base.validators.js";

export const addAttributeVariantSchema = Joi.object({
  variant_id: idSchema.required(),
  attribute_value_id: idSchema.required(),
});

export const updateAttributeVariantSchema = Joi.object({
  id: idSchema.required(),
  variant_id: idSchema,
  attribute_value_id: idSchema,
}).min(2);

export const changeAttributeVariantActivenessSchema = Joi.object({
  variant_id: idSchema.required(),
  attribute_value_id: idSchema.required(),
});
