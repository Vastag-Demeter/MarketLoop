import prisma from "../constants/db.js";
import { logger } from "../utils/logger.js";

export const getVendorEmails = async (req, res) => {
  const { vendor_id } = req.body;
  try {
    const emails = await prisma.VendorEmails.findMany({
      where: { vendor_id: vendor_id },
    });
    return res.status(200).json({ data: emails });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addVendorEmail = async (req, res) => {
  const { vendor_id, email, is_primary } = req.body;
  try {
    const existingEmail = await prisma.VendorEmails.findFirst({
      where: { vendor_id: vendor_id, email: email },
    });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists." });
    }

    if (is_primary) {
      const primaryEmail = await prisma.VendorEmails.findFirst({
        where: { vendor_id: vendor_id, is_primary: true },
      });
      if (primaryEmail) {
        await prisma.vendorEmails.update({
          where: {
            vendor_id: vendor_id,
            is_primary: true,
          },
          data: {
            is_primary: false,
          },
        });
      }
    }

    const createdEmail = await prisma.VendorEmails.create({
      data: {
        vendor_id: vendor_id,
        email: email,
        is_primary: is_primary,
      },
    });
    return res
      .status(201)
      .json({ msg: "Vendor email created successfully.", data: createdEmail });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateVendorEmail = async (req, res) => {
  const { id, vendor_id, email, is_primary } = req.body;
  const data = {};
  if (vendor_id) data.vendor_id = vendor_id;
  if (email) {
    data.email = email;
  }
  if (is_primary) {
    data.is_primary = is_primary;
  }

  try {
    const existingEmail = await prisma.vendorEmails.findFirst({
      where: { id: id },
    });
    if (!existingEmail) {
      return res.status(404).json({ error: "Vendor email not found." });
    }
    if (existingEmail.is_primary == data.is_primary) {
      return res.status(400).json({
        error: "Email is already in the specified state, update aborted.",
      });
    }

    if (data.is_primary) {
      await prisma.vendorEmails.update({
        where: {
          vendor_id: existingEmail.vendor_id,
          is_primary: true,
        },
        data: {
          is_primary: false,
        },
      });
    }

    const updatedEmail = await prisma.vendorEmails.update({
      where: {
        id: id,
      },
      data: data,
    });
    return res
      .status(200)
      .json({ msg: "Vendor email updated successfully.", data: updatedEmail });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const changeVendorEmailActiveness = async (req, res) => {
  const { id } = req.body;
  try {
    const email = await prisma.vendorEmails.findFirst({
      where: {
        id: id,
      },
    });
    if (!email) {
      return res.status(400).json({
        error: "Email not found.",
      });
    }
    const changedEmail = await prisma.vendorEmails.update({
      where: {
        id: id,
      },
      data: {
        is_active: !email.is_active,
      },
    });
    return res.status(200).json({
      msg: "Vendor email activeness updated successfully.",
      data: changedEmail,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
