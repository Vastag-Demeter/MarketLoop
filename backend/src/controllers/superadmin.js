import bcrypt from "bcryptjs";
import prisma from "../constants/db.js";
import { logger } from "../utils/logger.js";

export const getAllUsers = async (req, res) => {
  const user = req.user;
  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: user.user_id,
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return res.status(200).json({ data: users });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const createStaff = async (req, res) => {
  const { first_name, last_name, email, password, role_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          first_name,
          last_name,
          email,
          password: hashedPassword,
          verified_at: new Date(),
          active: true,
        },
      });

      await tx.userRoles.create({
        data: {
          user_id: newUser.id,
          role_id: role_id,
        },
      });

      return newUser;
    });

    return res
      .status(201)
      .json({ msg: "Staff member created successfully.", data: result });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const toggleUserStatus = async (req, res) => {
  const { user_id } = req.body;

  try {
    const foundUser = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!foundUser) return res.status(404).json({ error: "User not found." });

    const updatedUser = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        active: !foundUser.active,
      },
    });

    const status = updatedUser.active ? "activated" : "deactivated";
    return res.status(200).json({ msg: `User successfully ${status}.` });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
