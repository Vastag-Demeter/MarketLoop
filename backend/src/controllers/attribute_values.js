import {
  isEmptyOrWhiteSpace,
  isEmptyOrWhiteSpaceList,
} from "../functions/functions.js";
import { ROLES } from "../constants/roles.js";
import prisma from "../constants/db.js";
import {
  getAttributeValuesByVariantIdSchema,
  getAttributeValuesSchema,
} from "../validators/attributeValue.validator.js";

export const getAttributeValues = async (req, res) => {
  const { attribute_id } = req.params;

  const { error } = getAttributeValuesSchema.validate({ attribute_id });

  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const attributeValues = await prisma.attributeValues.findMany({
      where: {
        is_active: true,
        attribute_id: attribute_id,
      },
    });
    return res.status(200).json({ data: attributeValues });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getAllAttributeValues = async (req, res) => {
  const { attribute_id } = req.params;
  const { error } = getAttributeValuesSchema.validate({ attribute_id });

  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const attributeValues = await prisma.attributeValues.findMany({
      where: { attribute_id: parseInt(attribute_id) },
    });
    return res.status(200).json({ data: attributeValues });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAttributeValuesByVariantId = async (req, res) => {
  const { variant_id } = req.params;
  const { error } = getAttributeValuesByVariantIdSchema.validate({
    variant_id,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const values = await prisma.attributeValues.findMany({
      where: {
        variantValues: {
          some: {
            variant_id: parseInt(variant_id),
          },
        },
      },
      select: {
        id: true,
        value: true,
        attribute: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json({ data: values });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addAttributeValue = async (req, res) => {
  const { attribute_id, value } = req.body;
  try {
    const attributeValue = await prisma.attributeValues.findFirst({
      where: {
        attribute_id: attribute_id,
        value: value,
      },
    });
    if (attributeValue) {
      return res
        .status(400)
        .json({ error: "Attribute value already exists for this attribute." });
    }
    const createdAttribute = await prisma.attributeValues.create({
      data: {
        attribute_id: attribute_id,
        value: value,
      },
    });
    return res.status(201).json({
      msg: "Attribute value created successfully.",
      data: createdAttribute,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateAttributeValue = async (req, res) => {
  const { id, attribute_id, value } = req.body;
  let data = {};
  if (attribute_id) data.attribute_id = attribute_id;
  if (value) data.value = value;

  try {
    const attributeValue = await prisma.attributeValues.findFirst({
      where: {
        id: id,
      },
    });
    if (!attributeValue)
      return res
        .status(404)
        .json({ error: "Attribute value not found with the given ID." });

    const updatedAttribute = await prisma.attributeValues.update({
      where: { id: id },
      data: data,
    });
    return res.status(200).json({
      msg: "Attribute value updated successfully.",
      data: updatedAttribute,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const changeAttributeValueActiveness = async (req, res) => {
  const { id } = req.body;
  try {
    const attributeValue = await prisma.attributeValues.findUnique({
      where: { id: id },
    });
    if (!attributeValue) {
      return res.status(404).json({
        error: "Attribute value not found.",
      });
    }
    const changedAttributeValue = await prisma.attributeValues.update({
      where: { id: id },
      data: { is_active: !attributeValue.is_active },
    });
    return res.status(200).json({
      msg: "Attribute value activeness status updated successfully.",
      data: changedAttributeValue,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
