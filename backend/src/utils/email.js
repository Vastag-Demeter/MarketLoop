import { Resend } from "resend";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import dns from "node:dns"; // DNS modul importálása

dotenv.config();

// Kényszerítjük a Node-ot, hogy az IPv4-et (127.0.0.1) preferálja az IPv6 (::1) helyett
dns.setDefaultResultOrder("ipv4first");

const resend = new Resend(process.env.RESEND_TOKEN);

export const sendEmail = async (options) => {
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
        port: process.env.MAILTRAP_PORT || 2525, // A 2525-ös port ajánlott
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: options.from || '"Dev-System" <dev@neo-shop.local>',
        to: options.email,
        subject: `[DEV] ${options.subject}`,
        html: options.message,
      });

      console.log("DEV MODE: Sent to Mailtrap. ID:", info.messageId);
      return info;
    } catch (err) {
      console.error("Mailtrap Error:", err.message);
      // Ne dobjunk hibát, hogy a fejlesztés ne álljon meg, ha nincs net
      return { error: err.message };
    }
  }

  if (env === "prod") {
    try {
      const { data, error } = await resend.emails.send({
        from: "NEO-SHOP <onboarding@resend.dev>",
        to: options.email,
        subject: options.subject,
        html: options.message,
      });

      if (error) throw new Error(error.message);

      console.log("PROD MODE: Sent via Resend. ID:", data.id);
      return data;
    } catch (err) {
      console.error("Resend Error:", err.message);
      throw err;
    }
  }
};
