import prisma from "../constants/db.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await prisma.roles.findMany();
    return res.status(200).json({ data: roles });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getRoleById = async (req, res) => {
  const id = req.body.id;
  try {
    const role = await prisma.roles.findFirst({
      where: {
        id: id,
      },
    });
    if (!role)
      return res
        .status(400)
        .json({ error: "No role found with the given ID." });
    return res.status(200).json({ data: role });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addRole = async (req, res) => {
  const name = req.body.name;

  try {
    const existingRole = await prisma.roles.findFirst({
      where: {
        name: name,
      },
    });
    if (existingRole)
      return res
        .status(400)
        .json({ error: "Role already exists with the given name." });

    const key = name.trim().replace(/\s+/g, "_").toUpperCase();
    const createdRole = await prisma.roles.create({
      data: {
        name: name,
        key: key,
      },
    });
    return res
      .status(201)
      .json({ msg: "Role added successfully.", data: createdRole });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateRole = async (req, res) => {
  const { id, name } = req.body;

  try {
    const existingRole = await prisma.roles.findFirst({
      where: {
        name: name,
      },
    });
    if (existingRole)
      return res
        .status(400)
        .json({ error: "Role already exists with the given name." });
    const role = await prisma.roles.findFirst({
      where: {
        id: id,
      },
    });
    if (!role)
      return res
        .status(400)
        .json({ error: "Role not found with the given ID." });

    const updatedRole = await prisma.roles.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });
    return res
      .status(200)
      .json({ msg: "Role updated successfully.", data: updatedRole });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const toggleRoleActiveness = async (req, res) => {
  const id = req.body.id;

  try {
    const role = await prisma.roles.findFirst({
      where: {
        id: id,
      },
    });
    if (!role)
      return res
        .status(400)
        .json({ error: "Role not found with the given ID." });
    await prisma.roles.update({
      where: {
        id: id,
      },
      data: {
        is_active: !role.is_active,
      },
    });
    return res.status(200).json({ msg: "Role status changed successfully." });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
