import prisma from "../constants/db.js";
import { logger } from "../utils/logger.js";

export const getAllAttributes = async (req, res) => {
  try {
    const attributes = await prisma.attributes.findMany({
      include: {
        attributeValues: true,
      },
    });
    return res.status(200).json({ data: attributes });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getActiveAttributes = async (req, res) => {
  try {
    const attributes = await prisma.attributes.findMany({
      where: {
        is_active: true,
      },
      include: {
        attributeValues: {
          where: {
            is_active: true,
          },
        },
      },
    });

    return res.status(200).json({ data: attributes });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addAttribute = async (req, res) => {
  const name = req.body.name;
  try {
    const createdAttribute = await prisma.attributes.create({
      data: {
        name: name,
      },
    });
    return res
      .status(201)
      .json({ msg: "Attribute created successfully.", data: createdAttribute });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateAttribute = async (req, res) => {
  const { id, name } = req.body;
  try {
    const updatedAttribute = await prisma.attributes.update({
      where: { id: id },
      data: {
        name: name,
      },
    });

    return res
      .status(200)
      .json({ msg: "Attribute updated successfully.", data: updatedAttribute });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const changeAttributeActiveness = async (req, res) => {
  const { id } = req.body;
  try {
    const attribute = await prisma.attributes.findUnique({
      where: { id: id },
    });

    if (!attribute) {
      return res.status(404).json({
        error: "Attribute not found.",
      });
    }
    const changedAttribute = await prisma.attributes.update({
      where: { id: id },
      data: { is_active: !attribute.is_active },
    });
    return res.status(200).json({
      msg: "Attribute activeness updated successfully.",
      data: changedAttribute,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
