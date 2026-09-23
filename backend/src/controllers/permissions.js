import prisma from "../constants/db.js";

export const getPermissions = async (req, res) => {
  try {
    const permissions = await prisma.permissions.findMany({
      include: {
        role: {
          include: {
            role: true,
          },
        },
      },
    });
    return res.status(200).json({ data: permissions });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addPermissionToRole = async (req, res) => {
  const { permission_id, role_id } = req.body;

  try {
    const foundPermission = await prisma.permissions.findUnique({
      where: {
        id: permission_id,
      },
    });
    if (!foundPermission)
      return res.status(404).json({ error: "Permission not found." });
    const foundRole = await prisma.roles.findUnique({
      where: {
        id: role_id,
      },
    });
    if (!foundRole) return res.status(404).json({ error: "Role not found" });

    const existingConnection = await prisma.rolePermission.findUnique({
      where: {
        role_id_permission_id: {
          role_id: role_id,
          permission_id: permission_id,
        },
      },
    });
    if (existingConnection)
      return res
        .status(400)
        .json({ error: "Permission is already given to role." });

    await prisma.rolePermission.create({
      data: {
        role_id: role_id,
        permission_id: permission_id,
      },
    });
    return res.status(201).json({ msg: "Permission added to role." });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deletePermissionFromRole = async (req, res) => {
  const { role_id, permission_id } = req.body;

  try {
    const foundConnection = await prisma.rolePermission.findUnique({
      where: {
        role_id_permission_id: {
          role_id: role_id,
          permission_id: permission_id,
        },
      },
    });
    if (!foundConnection)
      return res.status(404).json({ error: "Connection not found." });

    await prisma.rolePermission.delete({
      where: {
        role_id_permission_id: {
          role_id: role_id,
          permission_id: permission_id,
        },
      },
    });

    return res.status(201).json({ msg: "Permission added to role." });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
