import prisma from "../constants/db.js";

export const getCreditCards = async (req, res) => {
  const userID = req.user.user_id;

  try {
    const creditCards = await prisma.creditCards.findMany({
      where: {
        user_id: userID,
      },
    });
    return res.status(200).json({ data: creditCards });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addCreditCard = async (req, res) => {
  const userID = req.user.user_id;
  const { card_token, last_four, expiry, card_type } = req.body;
  try {
    const creditCard = await prisma.creditCards.create({
      data: {
        user_id: userID,
        card_token: card_token,
        last_four: last_four,
        expiration_date: expiry,
        card_type: card_type,
      },
    });
    return res
      .status(201)
      .json({ msg: "Credit card added successfully.", data: creditCard });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCreditCard = async (req, res) => {
  const userID = req.user.user_id;
  const { id, card_token, last_four, expiration_date, card_type } = req.body;
  const data = {};
  if (card_token) data.card_token = card_token;
  if (last_four) data.last_four = last_four;
  if (expiration_date) data.expiration_date = expiration_date;
  if (card_type) data.card_type = card_type;

  try {
    const foundCard = await prisma.creditCards.findFirst({
      where: {
        id: id,
      },
    });

    if (!foundCard || foundCard.user_id !== userID) {
      return res.status(404).json({ error: "Credit card not found" });
    }

    const creditCard = await prisma.creditCards.update({
      where: {
        id: id,
        user_id: userID,
      },
      data: data,
    });
    return res
      .status(200)
      .json({ msg: "Credit card updated successfully", data: creditCard });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCreditCard = async (req, res) => {
  const userID = req.user.user_id;
  const id = req.body.id;

  try {
    const foundCard = await prisma.creditCards.findFirst({
      where: {
        id: id,
      },
    });

    if (!foundCard || foundCard.user_id !== userID) {
      return res.status(404).json({ error: "Credit card not found" });
    }

    await prisma.creditCards.delete({
      where: {
        id: id,
        user_id: userID,
      },
    });

    return res.status(200).json({ msg: "Credit card deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
