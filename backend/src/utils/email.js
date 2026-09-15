import { Resend } from "resend";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {Brevo} from "@getbrevo/brevo";


dotenv.config();


export const sendEmail = async (options) => {
  console.log("[LOG]: SENDING EMAIL...")
  const env = process.env.NODE_ENV;

  if (env === "test") {
    console.log("TEST MODE: Email log only:", options.email);
    return { id: "test-id" };
  }

  if (env === "dev") {
    try {
      console.log(
        "Mailtrap Auth:",
        process.env.MAILTRAP_USER,
        process.env.MAILTRAP_PASS,
      );
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

      console.log("DEV MODE: Sent to Mailtrap. ID:", info.messageId);
      return info;
    } catch (err) {
      console.error("Mailtrap Error:", err.message);
      return { error: err.message };
    }
  }

  if (env === "prod") {

    const apiKey = process.env.BREVO_KEY;

      if (!apiKey) {
        console.error("[PROD] Error: API key is missing for .env!");
        return { error: "BREVO_KEY_MISSING" };
      }

      try {

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "accept": "application/json",
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
          console.error("[PROD] Brevo API Error:", data);
          return { error: data.message || "EMAIL_SEND_FAILED" };
        }

        console.log("[PROD] Email sent successfully! Message ID:", data.messageId);
        return data;
      } catch (err) {
        console.error("[PROD] Network error while sending mail:", err.message);
        return { error: err.message };
      }


  }
};
