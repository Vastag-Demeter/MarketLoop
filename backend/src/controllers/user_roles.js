import prisma from "../constants/db.js";

export const addUserRole = async (req, res) => {
  const { user_id, role_id } = req.body;

  try {
    const role = await prisma.roles.findFirst({
      where: {
        id: role_id,
        is_active: true,
      },
    });

    if (!role)
      return res.status(404).json({ error: "Role not found or inactive." });
    const foundRole = await prisma.userRoles.findFirst({
      where: {
        user_id: user_id,
        role_id: role_id,
      },
      include: {
        role: true,
      },
    });

    if (foundRole)
      return res.status(400).json({ error: "Role is already given to user." });

    await prisma.userRoles.create({
      data: {
        user_id: user_id,
        role_id: role_id,
      },
    });

    return res.status(201).json({ msg: "Role successfully given to user." });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteUserRole = async (req, res) => {
  const { user_id, role_id } = req.body;

  try {
    const foundRole = await prisma.userRoles.findFirst({
      where: {},
    });
    if (!foundRole)
      return res.status(404).json({ error: "User role not found." });

    await prisma.userRoles.delete({
      where: {
        user_id_role_id: {
          user_id: user_id,
          role_id: role_id,
        },
      },
    });

    return res.status(200).json({ msg: "User role deleted successfully." });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
