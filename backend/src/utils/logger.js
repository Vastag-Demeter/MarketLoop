import { Logtail } from "@logtail/node";
import dotenv from "dotenv";
dotenv.config();
const isProd =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod";

const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN || "");

export const logger = {
  info: (message, context = {}) => {
    if (isProd) {
      logtail.warn(message, context);
    } else {
      console.warn(
        `[WARN] ${message}`,
        Object.keys(context).length ? context : "",
      );
    }
  },

  warn: (message, context = {}) => {
    if (isProd) {
      logtail.warn(message, context);
    } else {
      console.warn(
        `[WARN] ${message}`,
        Object.keys(context).length ? context : "",
      );
    }
  },

  error: (message, context = {}) => {
    if (isProd) {
      logtail.error(message, context);
    } else {
      console.error(
        `[ERROR] ${message}`,
        Object.keys(context).length ? context : "",
      );
    }
  },
};
