import prisma from "../constants/db.js";
import { logger } from "../utils/logger.js";

export const getEmailTypes = async (req, res) => {
  try {
    const emailTypes = await prisma.emailTypes.findMany({
      where: {
        is_active: true,
      },
    });
    return res.status(200).json({ data: emailTypes });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getAllEmailTypes = async (req, res) => {
  try {
    const emailType = await prisma.emailTypes.findMany();
    return res.status(200).json({ data: emailType });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getEmailTypeById = async (req, res) => {
  const id = req.body.id;
  try {
    const type = await prisma.emailTypes.findFirst({
      where: {
        id: id,
      },
    });
    if (!type)
      return res
        .status(400)
        .json({ error: "Email type not exists with the given ID." });
    return res.status(200).json({ data: type });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addEmailType = async (req, res) => {
  const name = req.body.name;

  try {
    const type = await prisma.emailTypes.findFirst({
      where: {
        name: name,
      },
    });
    if (type)
      return res
        .status(400)
        .json({ error: "Email type with this name already exists." });

    const newType = await prisma.emailTypes.create({
      data: {
        name: name,
      },
    });
    return res
      .status(201)
      .json({ msg: "Email type created successfully.", data: newType });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateEmailType = async (req, res) => {
  const { id, name } = req.body;

  try {
    const type = await prisma.emailTypes.findFirst({
      where: {
        name: name,
      },
    });
    if (type)
      return res
        .status(400)
        .json({ error: "Email type already exists with the given name." });
    const updatedType = await prisma.emailTypes.update({
      where: { id: id },
      data: {
        name: name,
      },
    });
    return res
      .status(200)
      .json({ msg: "Email type updated successfully", data: updatedType });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const toggleEmailTypeActiveness = async (req, res) => {
  const id = req.body.id;

  try {
    const type = await prisma.emailTypes.findFirst({
      where: {
        id: id,
      },
    });
    if (!type)
      return res
        .status(400)
        .json({ error: "Email type not found with the given ID." });
    await prisma.emailTypes.update({
      where: {
        id: id,
      },
      data: {
        is_active: !type.is_active,
      },
    });

    return res.status(200).json({ msg: "Status changed successfully." });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
