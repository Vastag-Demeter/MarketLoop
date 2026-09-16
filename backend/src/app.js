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

const allowedOrigins = [
  "http://localhost:3000",
  "https://market-loop-khaki.vercel.app",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy error: Origin not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

app.use("/api", userRouter);
app.use("/api", transactionRouter);
app.use("/api", productRouter);
app.use("/api", serviceRouter);
app.use("/api", orderRoutes);
app.use("/api", helpdeskRoutes);
export default app;
