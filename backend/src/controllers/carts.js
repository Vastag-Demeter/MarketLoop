import { isEmptyOrWhiteSpace } from "../functions/functions.js";
import prisma from "../constants/db.js";
import { getCartSchema } from "../validators/cart.validator.js";
import { logger } from "../utils/logger.js";

export const getCart = async (req, res) => {
  const { error, value } = getCartSchema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = req.user;
  const session_token = value.session_token;

  if (!user?.user_id && !session_token) {
    return res
      .status(400)
      .json({ error: "Authentication or session token required." });
  }
  try {
    const cart = await prisma.carts.findFirst({
      where: {
        OR: [{ user_id: user?.user_id }, { session_token: session_token }],
      },
      include: {
        cartItems: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!cart) return res.status(404).json({ error: "Cart not found." });
    return res.status(200).json({ data: cart });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const createCart = async (req, res) => {
  const { session_token } = req.body;
  try {
    const foundCart = await prisma.carts.findFirst({
      where: {
        session_token: session_token,
      },
    });

    if (foundCart) return res.status(200).json({ data: foundCart });

    const cart = await prisma.carts.create({
      data: {
        session_token: session_token,
      },
      select: {
        id: true,
        user_id: true,
        session_token: true,
      },
    });

    return res
      .status(201)
      .json({ msg: "Cart created successfully.", data: cart });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateCart = async (req, res) => {
  const session_token = req.body.session_token;
  const user = req.user;
  try {
    const cart = await prisma.carts.update({
      where: {
        session_token: session_token,
      },
      data: {
        user_id: user.user_id,
      },
    });

    return res
      .status(200)
      .json({ msg: "Cart updated successfully.", data: cart });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

//Not sure if it's needed.
export const deleteCart = async (req, res) => {
  const id = req.body.id;
  const session_token = req.body.session_token;
  const user = req.user;

  if (!Number.isInteger(user.id) && isEmptyOrWhiteSpace(session_token))
    return res
      .status(400)
      .json({ error: "Cannot delete cart without authentication." });
  try {
    const cart = await prisma.carts.findFirst({
      where: {
        id: id,
      },
    });
    if (
      !cart ||
      (cart.user_id !== user.id && cart.session_token !== session_token)
    )
      return res.status(400).json({ error: "Cart not found." });

    await prisma.carts.delete({
      where: {
        OR: [{ user_id: user.id }, { session_token: session_token }],
      },
    });

    return res.status(200).json({ msg: "Cart deleted successfully." });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
