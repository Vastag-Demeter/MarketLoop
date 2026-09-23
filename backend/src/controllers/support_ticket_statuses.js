import prisma from "../constants/db.js";

export const getSupportTicketStatuses = async (req, res) => {
  try {
    const statuses = await prisma.supportTicketStatuses.findMany({
      where: {
        is_active: true,
      },
    });
    return res.status(200).json({ data: statuses });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getAllSupportTicketStatuses = async (req, res) => {
  try {
    const statuses = await prisma.supportTicketStatuses.findMany();
    return res.status(200).json({ data: statuses });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getSupportTicketStatusById = async (req, res) => {
  const id = req.body.id;

  try {
    const status = await prisma.supportTicketStatuses.findFirst({
      id: id,
    });
    if (!status)
      return res
        .status(400)
        .json({ error: "Support ticket status not found with the given ID." });

    return res.status(200).json({ data: status });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addSupportTicketStatus = async (req, res) => {
  const name = req.body.name;

  try {
    const existingStatus = await prisma.supportTicketStatuses.findFirst({
      where: {
        name: name,
      },
    });
    if (existingStatus)
      return res.status(400).json({
        error: "Support ticket status already exists with the given name.",
      });

    const createdStatus = await prisma.supportTicketStatuses.create({
      data: {
        name: name,
      },
    });
    return res.status(201).json({
      msg: "Support ticket status created successfully.",
      data: createdStatus,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateSupportTicketStatus = async (req, res) => {
  const { id, name } = req.body;

  try {
    const statusWithGivenName = await prisma.supportTicketStatuses.findFirst({
      where: {
        name: name,
      },
    });
    if (statusWithGivenName)
      return res.status(400).json({
        error: "Support ticket status with the given name already exists.",
      });
    const existingStatus = await prisma.supportTicketStatuses.findFirst({
      where: {
        id: id,
      },
    });
    if (!existingStatus)
      return res
        .status(400)
        .json({ error: "Support ticket status not found with the given ID." });

    const updatedStatus = await prisma.supportTicketStatuses.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });
    return res.status(200).json({
      msg: "Support ticket status updated successfully.",
      data: updatedStatus,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const toggleSupportTicketStatus = async (req, res) => {
  const id = req.body.id;

  try {
    const existingStatus = await prisma.supportTicketStatuses.findFirst({
      where: {
        id: id,
      },
    });

    if (!existingStatus)
      return res
        .status(400)
        .json({ error: "Support ticket status not found with the given ID." });

    await prisma.supportTicketStatuses.update({
      where: {
        id: id,
      },
      data: {
        is_active: !existingStatus.is_active,
      },
    });
    return res.status(200).json({
      msg: "Support ticket status changed successfully.",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
