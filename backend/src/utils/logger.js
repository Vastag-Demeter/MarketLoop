import { Logtail } from "@logtail/node";
import dotenv from "dotenv";
dotenv.config();
const token = process.env.LOGTAIL_SOURCE_TOKEN;

const endpoint = "https://s2772572.us-west-2a.betterstackdata.com";

export const logtail = new Logtail(token, {
  endpoint: endpoint,
});

export const logger = {
  info: async (message, context = {}) => {
    console.log(`[INFO] ${message}`, context);
    await logtail.info(message, context);
    await logtail.flush();
  },
  warn: async (message, context = {}) => {
    console.warn(`[WARN] ${message}`, context);
    await logtail.warn(message, context);
    await logtail.flush();
  },
  error: async (message, error = null, context = {}) => {
    console.error(`[ERROR] ${message}`, error);
    await logtail.error(message, {
      ...context,
      errorMessage: error?.message || error,
      stack: error?.stack || null,
    });
    await logtail.flush();
  },
};
