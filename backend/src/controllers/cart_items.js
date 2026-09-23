import prisma from "../constants/db.js";
import { deleteCartItemSchema } from "../validators/cartItem.validator.js";

export const getCartItems = async (req, res) => {
  const { cart_id } = req.body;
  try {
    const items = await prisma.cartItems.findMany({
      where: {
        cart_id: cart_id,
      },
      include: {
        variant: true,
      },
    });

    return res.status(200).json({ data: items });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getCartItemById = async (req, res) => {
  const id = req.body.id;

  try {
    const item = await prisma.cartItems.findFirst({
      where: {
        id: id,
      },
      include: { variant: true },
    });
    if (!item) return res.status(400).json({ error: "Cart item not found." });
    return res.status(200).json({ data: item });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addCartItem = async (req, res) => {
  const { cart_id, variant_id, quantity, selected_attributes } = req.body;

  try {
    const createdItem = await prisma.cartItems.create({
      data: {
        cart_id: cart_id,
        variant_id: variant_id,
        quantity: quantity,
        selected_attributes: selected_attributes,
      },
    });

    return res
      .status(201)
      .json({ msg: "Item successfully added to cart.", data: createdItem });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateCartItem = async (req, res) => {
  const { id, quantity, session_token } = req.body;
  const user = req.user;
  try {
    const item = await prisma.cartItems.findFirst({
      where: {
        id: id,
      },
      include: {
        cart: true,
      },
    });

    if (!item) return res.status(400).json({ error: "Item not found." });
    if (
      item.cart.user_id !== user?.user_id &&
      item.cart.session_token !== session_token
    )
      return res.status(400).json({ error: "Unauthorized." });

    const updatedItem = await prisma.cartItems.update({
      where: {
        id: id,
      },
      data: {
        quantity: quantity,
      },
    });

    return res
      .status(200)
      .json({ msg: "Cart item updated successfully", data: updatedItem });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteCartItem = async (req, res) => {
  const id = parseInt(req.params.id);
  const { session_token } = req.body;

  const { error } = deleteCartItemSchema.validate({ id, session_token });
  if (error) return res.status(400).json({ error: error.details[0].message });
  const user = req.user;

  try {
    const result = await prisma.cartItems.deleteMany({
      where: {
        id: id,
        cart: {
          is: {
            OR: [{ session_token: session_token }, { user_id: user?.user_id }],
          },
        },
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    return res.status(200).json({ message: "Cart item deleted successfully." });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
