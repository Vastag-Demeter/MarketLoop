import { sendEmail } from "../utils/email.js";
import { activationEmailTemplate } from "../templates/accountActivation.js";
import prisma from "../constants/db.js";
import { EMAIL_TYPES } from "../constants/emailTypes.js";

export const editProfile = async (req, res) => {
  const { firstName, lastName } = req.body;
  const userID = req.user.user_id;

  const dataToUpdate = {};

  if (firstName) dataToUpdate.first_name = firstName;
  if (lastName) dataToUpdate.last_name = lastName;

  if (Object.keys(dataToUpdate) === 0) {
    return res.status(400).json({ error: "No data given for update." });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userID,
      },
      data: dataToUpdate,
    });

    return res
      .status(200)
      .json({ msg: "Profile updated successfully", data: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getProfileData = async (req, res) => {
  const userID = req.user.user_id;
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userID,
      },
      select: {
        email: true,
        first_name: true,
        last_name: true,
        verified_at: true,
      },
    });

    return res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const activateAccount = async (req, res) => {
  const email = req.body.email;
  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!foundUser)
      return res
        .status(400)
        .json({ error: "There is no user with the given email address." });

    if (foundUser.active)
      return res.status(400).json({ error: "User is already active." });

    const foundCode = await prisma.userActivations.findFirst({
      where: {
        user_id: foundUser.id,
        expires_at: {
          gt: new Date(),
        },
        activated_at: null,
      },
    });

    if (!foundCode) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);
      const insertedCode = await prisma.userActivations.create({
        data: {
          user_id: foundUser.id,
          code: code,
          expires_at: expiresAt,
        },
      });

      const subject = "Account Activation";
      const message = activationEmailTemplate(insertedCode.code);
      sendEmail({
        from: "Account Activation <activation.webshop@webshop.hu>",
        email: email,
        subject: subject,
        message: message,
      });
      await prisma.emailLogs.create({
        data: {
          recipient_email: foundUser.email,
          user_id: foundUser.id,
          type_id: EMAIL_TYPES["USER_ACTIVATION"],
          subject: subject,
          body: message,
        },
      });
      return res.status(201).json({ msg: "Code sent. Expires in 10 minutes." });
    }

    const code = req.body.code;
    if (foundCode.code != code) {
      return res.status(400).json({ error: "Code is invalid." });
    }

    await prisma.userActivations.update({
      where: {
        id: foundCode.id,
      },
      data: { activated_at: new Date() },
    });

    await prisma.user.update({
      where: { id: foundUser.id },
      data: { active: true },
    });

    return res.status(200).json({ msg: "User activated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const disableAccount = async (req, res) => {
  const userID = req.user.user_id;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userID,
      },
    });

    if (!user.active) {
      return res.status(400).json({ error: "User is already disabled." });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        active: false,
      },
    });

    if (updatedUser) {
      res.clearCookie("token");
      return res.status(201).json({ msg: "User disabled successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
