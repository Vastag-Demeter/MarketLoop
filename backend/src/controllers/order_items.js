import prisma from "../constants/db.js";

export const getOrderItems = async (req, res) => {
  const orderID = req.body.order_id;
  const user = req.user;
  try {
    const items = await prisma.orderItems.findMany({
      where: {
        order_id: orderID,
      },
      include: {
        variant: {
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
        },
        order: true,
      },
    });

    if (!items || items[0].order.user_id !== user.id)
      return res
        .status(400)
        .json({ error: "Order item not found with the given ID." });
    return res.status(200).json({ data: items });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getOrderItemById = async (req, res) => {
  const id = req.body.id;
  const user = req.user;

  try {
    const item = await prisma.orderItems.findFirst({
      where: {
        id: id,
      },
      include: {
        variant: {
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
        },
        order: true,
      },
    });

    if (!item || item.order.user_id !== user.user_id)
      return res
        .status(400)
        .json({ error: "Order item not found with the given ID." });
    return res.status(200).json({ data: item });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
