import prisma from "../constants/db.js";
export const getPhoneNumbers = async (req, res) => {
  const userID = req.user.user_id;

  const phoneNumbers = await prisma.phoneNumbers.findMany({
    where: {
      user_id: userID,
    },
    select: {
      id: true,
      phone_number: true,
    },
  });

  return res.status(200).json({ data: phoneNumbers });
};

export const addPhoneNumber = async (req, res) => {
  const number = req.body.phone_number;
  const userID = req.user.user_id;

  try {
    const createdPhoneNumber = await prisma.phoneNumbers.create({
      data: {
        user_id: userID,
        phone_number: number,
      },
    });
    return res.status(201).json({
      msg: "Phone number added successfully.",
      data: createdPhoneNumber,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updatePhoneNumber = async (req, res) => {
  const number = req.body.phone_number;
  const userID = req.user.user_id;
  const id = req.body.id;

  try {
    const foundNumber = await prisma.phoneNumbers.findFirst({
      where: {
        id: id,
      },
    });
    if (!foundNumber || foundNumber.user_id !== userID) {
      return res
        .status(404)
        .json({ error: "Phone number not found or not owned by user." });
    }

    const updatedPhoneNumber = await prisma.phoneNumbers.update({
      where: {
        id: id,
      },
      data: {
        phone_number: number,
      },
    });

    return res.status(201).json({
      msg: "Phone number updated successfully.",
      data: updatedPhoneNumber,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deletePhoneNumber = async (req, res) => {
  const id = req.body.id;
  const userID = req.user.user_id;

  try {
    const foundNumber = await prisma.phoneNumbers.findFirst({
      where: {
        id: id,
      },
    });
    if (!foundNumber || foundNumber.user_id !== userID) {
      return res
        .status(404)
        .json({ error: "Phone number not found or not owned by user." });
    }

    const deletedNumber = await prisma.phoneNumbers.delete({
      where: {
        id: id,
      },
    });
    if (deletedNumber)
      return res
        .status(200)
        .json({ msg: "Phone number deleted successfully." });

    return res.status(404).json({ error: "Phone number not found." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
