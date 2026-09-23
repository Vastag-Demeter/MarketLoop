import dotenv from "dotenv";
import app from "./src/app.js";
import { logger } from "./src/utils/logger.js";

dotenv.config();
const port = process.env.BACKEND_PORT || process.env.PORT || 4000;

app.listen(port, "0.0.0.0", () => {
  logger.info("Server started...");
});
