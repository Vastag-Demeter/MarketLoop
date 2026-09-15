import prisma from "../constants/db.js";

export const getOrderStatuses = async (req, res) => {
  try {
    const statuses = await prisma.orderStatuses.findMany();

    return res.status(200).json({ data: statuses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getOrderStatusById = async (req, res) => {
  const id = req.body.id;
  try {
    const status = await prisma.orderStatuses.findFirst({
      where: {
        id: id,
      },
    });
    if (!status)
      return res
        .status(400)
        .json({ error: "Status not found with the given ID." });

    return res.status(200).json({ data: status });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addOrderStatus = async (req, res) => {
  const { name, is_final } = req.body;
  try {
    const existingStatus = await prisma.orderStatuses.findFirst({
      where: {
        name: name,
      },
    });
    if (existingStatus)
      return res
        .status(400)
        .json({ error: "Order status already exists with the given name." });

    if (is_final)
      await prisma.orderStatuses.update({
        where: { is_final: true },
        data: { is_final: false },
      });

    const status = await prisma.orderStatuses.create({
      data: {
        name: name,
        is_final: is_final,
      },
    });

    return res
      .status(201)
      .json({ msg: "Order status added successfully.", data: status });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateOrderStatus = async (req, res) => {
  const id = req.body.id;
  const name = req.body.name;

  try {
    const existingStatus = await prisma.orderStatuses.findFirst({
      where: {
        id: id,
      },
    });
    if (!existingStatus)
      return res
        .status(400)
        .json({ error: "Status not found with the given ID." });

    const updatedStatus = await prisma.orderStatuses.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });

    return res
      .status(200)
      .json({ msg: "Order status updated successfully.", data: updatedStatus });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const changeFinalOrderStatus = async (req, res) => {
  const id = req.body.id;

  try {
    const existingStatus = await prisma.orderStatuses.findFirst({
      where: {
        id: id,
      },
    });
    if (!existingStatus)
      return res
        .status(400)
        .json({ error: "Order status not found with the given ID." });

    const updatedStatus = await prisma.orderStatuses.update({
      where: {
        id: id,
      },
      data: {
        is_final: !existingStatus.is_final,
      },
    });

    return res.status(200).json({
      msg: "Final order status changed successfully.",
      data: updatedStatus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteOrderStatus = async (req, res) => {
  const { id } = req.body;

  try {
    const status = await prisma.orderStatuses.findFirst({
      where: {
        id: id,
      },
    });
    if (!status)
      return res.status(400).json({
        error: "Order status not found with the given ID.",
      });

    await prisma.orderStatuses.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({ msg: "Order status deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
