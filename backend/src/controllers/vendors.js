import prisma from "../constants/db.js";
import { logger } from "../utils/logger.js";

export const getVendors = async (req, res) => {
  try {
    const vendors = await prisma.vendors.findMany({
      where: {
        is_active: true,
      },
      include: {
        emails: true,
      },
    });
    return res.status(200).json({ data: vendors });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getAllVendors = async (req, res) => {
  try {
    const vendors = await prisma.vendors.findMany({
      include: {
        emails: true,
      },
    });
    return res.status(200).json({ data: vendors });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getVendorById = async (req, res) => {
  const id = req.body.id;
  try {
    const vendor = await prisma.vendors.findUnique({
      where: { id: id },
      include: {
        emails: true,
      },
    });
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found." });
    }
    return res.status(200).json({ data: vendor });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addVendor = async (req, res) => {
  const name = req.body.name;

  try {
    const createdVendor = await prisma.vendors.create({
      data: {
        name: name,
      },
    });
    return res
      .status(201)
      .json({ msg: "Vendor created successfully.", data: createdVendor });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateVendor = async (req, res) => {
  const { id, name } = req.body;
  try {
    const updatedVendor = await prisma.vendors.update({
      where: { id: id },
      data: { name: name },
    });
    return res
      .status(200)
      .json({ msg: "Vendor updated successfully.", data: updatedVendor });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const changeVendorActiveness = async (req, res) => {
  const { id } = req.body;

  try {
    const vendor = await prisma.vendors.findFirst({
      where: {
        id: id,
      },
    });
    if (!vendor) {
      return res
        .status(404)
        .json({ error: "Vendor not found or already in the desired state." });
    }
    const changedVendor = await prisma.vendors.update({
      where: {
        id: id,
      },
      data: {
        is_active: !vendor.is_active,
      },
    });
    return res.status(200).json({
      msg: "Vendor activeness updated successfully.",
      data: changedVendor,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
