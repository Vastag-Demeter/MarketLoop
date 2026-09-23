import prisma from "../constants/db.js";
import { ROLES } from "../constants/roles.js";
import { logger } from "../utils/logger.js";

export const getPaymentMethods = async (req, res) => {
  try {
    const methods = await prisma.paymentMethods.findMany({
      where: {
        is_active: true,
      },
    });
    return res.status(200).json({ data: methods });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getPaymentMethodById = async (req, res) => {
  const id = req.body.id;
  const user = req.user;

  try {
    const method = await prisma.paymentMethods.findFirst({
      where: {
        id: id,
      },
    });
    if (!method || !user.roles.includes(ROLES.ADMIN))
      return res.status(400).json({ error: "Payment method not found." });
    return res.status(200).json({ data: method });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getAllPaymentMethods = async (req, res) => {
  try {
    const methods = await prisma.paymentMethods.findMany();
    return res.status(200).json({ data: methods });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addPaymentMethod = async (req, res) => {
  const name = req.body.name;
  try {
    const createdMethod = await prisma.paymentMethods.create({
      data: {
        name: name,
      },
    });
    return res
      .status(201)
      .json({ msg: "Payment method added successfully.", data: createdMethod });
  } catch (error) {
    logger.error(error);
    return res.status(200).json({ error: "Internal server error." });
  }
};

export const updatePaymentMethod = async (req, res) => {
  const { id, name } = req.body;

  try {
    const method = await prisma.paymentMethods.findFirst({
      where: {
        id: id,
      },
    });

    if (!method)
      return res.status(400).json({ error: "Payment method not found" });

    const existingMethod = await prisma.paymentMethods.findFirst({
      where: {
        name: name,
      },
    });
    if (existingMethod)
      return res
        .status(400)
        .json({ error: "Payment method already exists with the given name." });

    const updatedMethod = await prisma.paymentMethods.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });

    return res.status(200).json({
      msg: "Payment method successfully updated.",
      data: updatedMethod,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const changePaymentMethodActiveness = async (req, res) => {
  const id = req.body.id;

  try {
    const method = await prisma.paymentMethods.findFirst({ where: { id: id } });
    if (!method)
      return res.status(400).json({ error: "Payment method not found." });

    const changedMethod = await prisma.paymentMethods.update({
      where: {
        id: id,
      },
      data: {
        is_active: !method.is_active,
      },
    });

    return res.status(200).json({
      msg: "Method activeness changed successfully.",
      data: changedMethod,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
