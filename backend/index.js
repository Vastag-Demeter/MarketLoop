import dotenv from "dotenv";
import app from "./src/app.js";
import cors from "cors"

const corsOptions = {
  origin: 'https://market-loop-khaki.vercel.app/',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
dotenv.config();
const port = process.env.BACKEND_PORT || process.env.PORT || 4000;
app.listen(port, '0.0.0.0', () =>
  console.log(`Server is running at http://localhost:${port}`),
);
