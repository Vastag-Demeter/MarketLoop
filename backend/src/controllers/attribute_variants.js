import prisma from "../constants/db.js";
import { logger } from "../utils/logger.js";

export const getAttributeVariants = async (req, res) => {
  try {
    const attributeVariants = await prisma.variantAttributeValues.findMany({
      include: {
        variant: true,
        attributeValue: {
          include: {
            attribute: true,
          },
        },
      },
    });
    return res.status(200).json({ data: attributeVariants });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getActiveAttributeVariants = async (req, res) => {
  try {
    const attributeVariants = await prisma.variantAttributeValues.findMany({
      where: { is_active: true },
      include: {
        variant: true,
        attributeValue: {
          include: {
            attribute: true,
          },
        },
      },
    });
    return res.status(200).json({ data: attributeVariants });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addAttributeVariant = async (req, res) => {
  const { variant_id, attribute_value_id } = req.body;
  try {
    const createdAttribute = await prisma.variantAttributeValues.create({
      data: {
        variant_id: variant_id,
        attribute_value_id: attribute_value_id,
      },
    });
    return res.status(201).json({
      msg: "Attribute variant created successfully.",
      data: createdAttribute,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateAttributeVariant = async (req, res) => {
  const { id, variant_id, attribute_value_id } = req.body;
  let data = {};
  if (variant_id) data.variant_id = variant_id;
  if (attribute_value_id) data.attribute_value_id = attribute_value_id;

  try {
    const updatedVariant = await prisma.variantAttributeValues.update({
      where: { id: id },
      data: data,
    });

    return res.status(200).json({
      msg: "Attribute variant updated successfully.",
      data: updatedVariant,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const changeAttributeVariantActiveness = async (req, res) => {
  const { attribute_value_id, variant_id } = req.body;
  try {
    const attributeVariant = await prisma.variantAttributeValues.findFirst({
      where: { attribute_value_id: attribute_value_id, variant_id: variant_id },
    });
    if (!attributeVariant) {
      return res.status(404).json({ error: "Attribute variant not found." });
    }

    const changedVariant = await prisma.variantAttributeValues.update({
      where: { id: attributeVariant.id },
      data: { is_active: !attributeVariant.is_active },
    });

    return res.status(200).json({
      msg: "Attribute variant activeness changed successfully.",
      data: changedVariant,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
