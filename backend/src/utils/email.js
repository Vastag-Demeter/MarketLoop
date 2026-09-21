import { Resend } from "resend";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Brevo } from "@getbrevo/brevo";
import { logger } from "./logger.js";

dotenv.config();

export const sendEmail = async (options) => {
  const env = process.env.NODE_ENV;

  if (env === "test") {
    console.log("TEST MODE: Email log only:", options.email);
    return { id: "test-id" };
  }

  if (env === "dev") {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
        port: process.env.MAILTRAP_PORT || 2525,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: options.from || '"Dev-System" <MarketLoop>',
        to: options.email,
        subject: `[DEV] ${options.subject}`,
        html: options.message,
      });

      logger.info("DEV MODE: Sent to Mailtrap. ID:", { recipient: options });
      return info;
    } catch (err) {
      logger.error("Mailtrap error: ", err.message);
      return { error: err.message };
    }
  }

  if (env === "prod") {
    const apiKey = process.env.BREVO_KEY;

    if (!apiKey) {
      logger.error("[PROD] Error: API key is missing for .env!");
      return { error: "BREVO_KEY_MISSING" };
    }

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          sender: {
            name: "MarketLoop",
            email: "demetervastag05@gmail.com",
          },
          to: [{ email: options.email }],
          subject: options.subject,
          htmlContent: options.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        logger.error("[PROD] Brevo API Error:", data);
        return { error: data.message || "EMAIL_SEND_FAILED" };
      }

      logger.info("Email sent successfully! Message ID:", {
        messageId: data.messageId,
      });
      return data;
    } catch (err) {
      logger.error("[PROD] Network error while sending mail:", err.message);
      return { error: err.message };
    }
  }
};
