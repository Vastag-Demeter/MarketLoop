import dotenv from "dotenv";
import app from "./src/app.js";
dotenv.config();
const port = process.env.BACKEND_PORT || process.env.PORT || 4000;
app.listen(port, '0.0.0.0', () =>
  console.log(`Server is running at http://localhost:${port}`),
);
