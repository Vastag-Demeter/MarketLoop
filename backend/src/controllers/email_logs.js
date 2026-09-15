import prisma from "../constants/db.js";

export const getEmailLogs = async (req, res) => {
  try {
    const logs = await prisma.emailLogs.findMany({
      select: {
        recipient_email: true,
        subject: true,
        sent_at: true,
      },
    });
    return res.status(200).json({ data: logs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getEmailLogById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || !Number.isInteger(id))
    return res
      .status(400)
      .json({ error: "ID is required and must be an integer." });

  try {
    const log = await prisma.emailLogs.findFirst({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        type: true,
      },
    });

    return res.status(200).json({ data: log });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
