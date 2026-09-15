import prisma from "../constants/db.js";

export const getAddresses = async (req, res) => {
  const userID = req.user.user_id;
  try {
    const addresses = await prisma.addresses.findMany({
      where: {
        user_id: userID,
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        house_number: true,
        floor: true,
        door: true,
        country: {
          select: {
            id: true,
            name: true,
          },
        },
        city: {
          select: {
            id: true,
            name: true,
            postal_code: true,
          },
        },
        street: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!addresses)
      return res.status(500).json({ error: "Internal server error." });

    return res.status(200).json({ data: addresses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addAddress = async (req, res) => {
  const userID = req.user.user_id;
  const { country, city, postal_code, street, house_number, floor, door } =
    req.body;
  try {
    const address = await prisma.$executeRaw`
		CALL insert_address(${userID} :: integer, ${country}, ${city}, ${postal_code}, ${street}, ${house_number}, ${floor} :: text, ${door} :: text)`;

    return res
      .status(201)
      .json({ msg: "Address added successfully.", data: address });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateAddress = async (req, res) => {
  const { id, country, city, postal_code, street, house_number, floor, door } =
    req.body;
  const userID = req.user.user_id;
  try {
    const address = await prisma.addresses.findFirst({
      where: {
        id: id,
      },
    });

    if (!address || address.user_id !== userID) {
      return res.status(403).json({
        error:
          "Address does not exist or you are not the owner of this address.",
      });
    }

    const updatedAdress = await prisma.$executeRaw`
		CALL update_address(
			${id}::integer,
			${country ?? null}::text,
			${city ?? null}::text,
			${postal_code ?? null}::text,
			${street ?? null}::text,
			${house_number ?? null}::text,
			${floor ?? null}::text,
			${door ?? null}::text
		)
		`;

    return res
      .status(201)
      .json({ msg: "Address updated successfully.", data: updatedAdress });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteAddress = async (req, res) => {
  const id = req.body.id;
  const user = req.user;

  const address = await prisma.addresses.findFirst({
    where: {
      id: id,
    },
  });

  if (!address || address.user_id !== user.user_id) {
    return res.status(403).json({
      error: "Address does not exist or you are not the owner of this address.",
    });
  }

  try {
    await prisma.addresses.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json({ msg: "Address deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
