import Joi from "joi";
import { idSchema, stringSchema } from "./base.validators.js";
export const getCategoryByIdSchema = Joi.object({
  id: idSchema,
});
export const addCategorySchema = Joi.object({
  parent_id: idSchema.allow(null),
  name: stringSchema.required(),
  slug: stringSchema.required(),
});

export const updateCategorySchema = Joi.object({
  id: idSchema.required(),
  parent_id: idSchema.allow(null),
  name: stringSchema,
  slug: stringSchema,
});

export const changeCategoryActivenessSchema = Joi.object({
  id: idSchema.required(),
});
