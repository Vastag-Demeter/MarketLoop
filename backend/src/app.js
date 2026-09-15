import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/users.routes.js";
import transactionRouter from "./routes/transactions.routes.js";
import productRouter from "./routes/products.routes.js";
import serviceRouter from "./routes/services.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import helpdeskRoutes from "./routes/helpdesk.routes.js";
import { loadStatuses } from "./constants/ticketStatuses.js";
import { loadEmailTypes } from "./constants/emailTypes.js";

dotenv.config();

const app = express();
await loadStatuses();
await loadEmailTypes();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/api", userRouter);
app.use("/api", transactionRouter);
app.use("/api", productRouter);
app.use("/api", serviceRouter);
app.use("/api", orderRoutes);
app.use("/api", helpdeskRoutes);
export default app;
