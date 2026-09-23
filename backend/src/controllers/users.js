import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ROLES, verificationDuration } from "../constants/roles.js";
import {
  isEmailValid,
  isEmptyOrWhiteSpace,
  isEmptyOrWhiteSpaceList,
} from "../functions/functions.js";
import { welcomeEmailTemplate } from "../templates/registyEmailTemplate.js";
import { newTokenEmailTemplate } from "../templates/newTokenEmailTemplate.js";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto";
import prisma from "../constants/db.js";
import { EMAIL_TYPES } from "../constants/emailTypes.js";
const saltRounds = 10;

//Handle login
export const login = async (req, res) => {
  const existingToken = req.cookies.token;
  if (existingToken)
    return res.status(401).json({ error: "Already logged in. Access denied." });

  const { password } = req.body;
  const email = req.body.email?.toLowerCase();

  try {
    const userFound = await prisma.user.findFirst({
      where: { email },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!userFound)
      return res.status(401).json({ error: "Invalid email or password." });
    if (!userFound.active)
      return res.status(403).json({ error: "User is inactive." });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userFound.password,
    );
    if (!isPasswordCorrect)
      return res.status(401).json({ error: "Invalid email or password." });

    const roles = userFound.roles.map((ur) => ur.role.key);

    const permissions = [
      ...new Set(
        userFound.roles.flatMap((ur) =>
          ur.role.permissions.map((rp) => rp.permission.key),
        ),
      ),
    ];

    const token = jwt.sign(
      {
        user_id: userFound.id,
        email: userFound.email,
        first_name: userFound.first_name,
        last_name: userFound.last_name,
        roles: roles,
        permissions: permissions,
      },
      process.env.JWT_PASS,
      { expiresIn: "1h" },
    );

    const isProd =
      process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod";
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      maxAge: 3600000,
    });

    res.status(200).json({
      msg: "Successful login",
      user: {
        firstName: userFound.first_name,
        lastName: userFound.last_name,
        email: userFound.email,
        roles: roles,
        permissions: permissions,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Handle signup
export const signup = async (req, res) => {
  let { firstName, lastName, email, password } = req.body;
  email = email.toLowerCase();
  try {
    const foundUser = await prisma.user.findFirst({
      where: { email: email },
    });

    if (foundUser)
      return res
        .status(401)
        .json({ error: "User with the given email already exists." });
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const insertedUser = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        email: email,
      },
    });

    const role = await prisma.roles.findUnique({
      where: { key: ROLES.CUSTOMER },
    });

    const insertedRole = await prisma.userRoles.create({
      data: {
        user_id: insertedUser.id,
        role_id: role.id,
      },
    });

    if (!insertedRole)
      return res
        .status(500)
        .json({ error: "Signup failed due to internal server error." });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    console.log(process.env.FRONTEND_API_URL);
    const verificationUrl = `${process.env.FRONTEND_API_URL}/verify-email?token=${verificationToken}`;

    const insertToken = await prisma.userVerifications.create({
      data: {
        user_id: insertedUser.id,
        token: verificationToken,
        expires_at: new Date(Date.now() + verificationDuration),
      },
    });
    try {
      const subject = "Welcome to our WebShop";
      const message = welcomeEmailTemplate(verificationUrl);
      await sendEmail({
        from: "Account Registration <signup.webshop@webshop.hu>",
        email: req.body.email,
        subject: subject,
        message: message,
      });
      await prisma.emailLogs.create({
        data: {
          recipient_email: insertedUser.email,
          user_id: insertedUser.id,
          type_id: EMAIL_TYPES["VERIFICATION"],
          subject: subject,
          body: message,
        },
      });
    } catch (error) {
      console.error("EMAIL_ERROR: ", error);
    }

    return res.status(201).json({ msg: "Signup successfull." });
  } catch (error) {
    logger.error(error);
    return res.status(500).json("Internal server error");
  }
};

//Verify email by verification token
export const verifyEmail = async (req, res) => {
  const token = req.body.token;
  try {
    const foundToken = await prisma.userVerifications.findFirst({
      where: {
        token: token,
      },
    });

    if (!foundToken || foundToken.expires_at < Date.now()) {
      return res.status(400).json({ error: "Token is expired or not found." });
    }

    const updatedToken = await prisma.userVerifications.update({
      where: {
        token: token,
      },
      data: {
        verified_at: new Date(),
      },
    });

    const updatedUser = await prisma.user.update({
      where: {
        id: updatedToken.user_id,
      },
      data: {
        verified_at: new Date(),
      },
    });

    if (!updatedUser) {
      return res.status(500).json({ error: "Internal server error." });
    }

    return res.status(200).json({ msg: "Verified successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

//Send new token if the previous tokens are all expired, and user is not verified
export const sendNewVerificationToken = async (req, res) => {
  const email = req.body.email;

  try {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationUrl = `${process.env.FRONTEND_API_URL}/verify-email?token=${verificationToken}`;

    const getUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    const getTokens = await prisma.userVerifications.findMany({
      where: {
        user_id: getUser.id,
      },
    });

    for (const item of getTokens) {
      if (item.expires_at > Date.now() || item.verified_at !== null)
        return res.status(400).json({
          error: "Already have an active token or account is verified",
        });
    }

    const insertToken = await prisma.userVerifications.create({
      data: {
        user_id: getUser.id,
        token: verificationToken,
        expires_at: new Date(Date.now() + verificationDuration),
      },
    });

    try {
      const subject = "Verification email";
      const message = newTokenEmailTemplate(verificationUrl);
      sendEmail({
        from: "Account Verification <verification.webshop@webshop.hu>",
        email: email,
        subject: subject,
        message: message,
      });

      await prisma.emailLogs.create({
        data: {
          recipient_email: email,
          user_id: getUser.id,
          type_id: EMAIL_TYPES["VERIFICATION"],
          subject: subject,
          body: message,
        },
      });
    } catch (error) {
      console.log("EMAIL_ERROR: ", error);
    }

    return res.status(201).json({ msg: "Email sent successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const logout = async (req, res) => {
  const token = req.cookies.token;
  if (isEmptyOrWhiteSpace(token))
    return res.status(401).json({ error: "Not logged in. Access denied." });

  const isProd =
    process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod";
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  });
  return res.status(200).json({ msg: "Logged out succesfully" });
};
