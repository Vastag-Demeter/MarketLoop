import prisma from "../constants/db.js";
import { ROLES } from "../constants/roles.js";
import { getProductVariantsSchema } from "../validators/productVariant.validator.js";
import { logger } from "../utils/logger.js";

export const getProductVariants = async (req, res) => {
  const { product_id } = req.params;
  const { error } = getProductVariantsSchema.validate({ product_id });
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const productVariants = await prisma.productVariants.findMany({
      where: {
        product_id: parseInt(product_id),
      },
      include: {
        product: true,
        attributeValues: {
          include: {
            attributeValue: {
              include: {
                attribute: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json({ data: productVariants });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getActiveProductVariants = async (req, res) => {
  const { product_id } = req.body;
  try {
    const productVariants = await prisma.productVariants.findMany({
      where: {
        product_id: product_id,
        is_active: true,
      },
      include: {
        product: true,
        attributeValues: {
          include: {
            attributeValue: {
              include: {
                attribute: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json({ data: productVariants });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getProductVariantById = async (req, res) => {
  const user = req.user;
  const id = req.body.id;
  if (!Number.isInteger(id))
    return res
      .status(400)
      .json({ error: "ID is empty or contains only whitespace." });
  try {
    const productVariant = await prisma.productVariants.findUnique({
      where: { id: id },
      include: {
        product: true,
        attributeValues: {
          include: {
            attributeValue: {
              include: {
                attribute: true,
              },
            },
          },
        },
      },
    });
    if (!productVariant) {
      return res.status(404).json({ error: "Product variant not found." });
    }
    if (!productVariant.is_active && user.roles.includes(ROLES.CUSTOMER))
      return res.status(400).json({ Error: "This product is inactive." });
    return res.status(200).json({ data: productVariant });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addProductVariant = async (req, res) => {
  const { product_id, variant_sku, stock, price_modifier } = req.body;
  try {
    const createdVariant = await prisma.productVariants.create({
      data: {
        product_id: product_id,
        variant_sku: variant_sku,
        stock: stock,
        price_modifier: price_modifier,
      },
    });
    return res.status(201).json({
      msg: "Product variant created successfully.",
      data: createdVariant,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateProductVariant = async (req, res) => {
  const { id, product_id, variant_sku, stock, price_modifier } = req.body;
  let data = {};
  if (product_id) data.product_id = product_id;
  if (variant_sku) data.variant_sku = variant_sku;
  if (stock) data.stock = stock;
  if (price_modifier) data.price_modifier = price_modifier;

  try {
    const variant = await prisma.productVariants.findUnique({
      where: {
        id: id,
      },
    });

    if (!variant)
      return res.status(404).json({ error: "Product variant not found." });

    const updatedVariant = await prisma.productVariants.update({
      where: { id: id },
      data: data,
    });
    return res.status(200).json({
      msg: "Product variant updated successfully.",
      data: updatedVariant,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const changeProductVariantActiveness = async (req, res) => {
  const id = req.body.id;
  if (!Number.isInteger(id))
    return res
      .status(400)
      .json({ error: "ID is mandatory and must be a number." });

  try {
    const productVariant = await prisma.productVariants.findUnique({
      where: { id: id },
    });
    if (!productVariant) {
      return res.status(404).json({ error: "Product variant not found." });
    }
    const changedVariant = await prisma.productVariants.update({
      where: { id: id },
      data: { is_active: !productVariant.is_active },
    });
    return res.status(200).json({
      msg: "Product variant activeness updated successfully.",
      data: changedVariant,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const restockProductVariant = async (req, res) => {
  const { id, stock } = req.body;
  try {
    const productVariant = await prisma.productVariants.findUnique({
      where: { id: id },
    });
    if (!productVariant || !productVariant.is_active) {
      return res
        .status(404)
        .json({ error: "Product variant not found or is inactive." });
    }
    const restockedVariant = await prisma.productVariants.update({
      where: { id: id },
      data: { stock: productVariant.stock + parseInt(stock) },
    });
    return res.status(200).json({
      msg: "Product variant restocked successfully.",
      data: restockedVariant,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
