require("dotenv").config();
import express, { json } from "express";
import cors from "cors";
const app = express();
import { sync } from "./config/database";


// Middleware
app.use(json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


sync({ alter: true }) // Updates tables without dropping data
  .then(() => console.log("✅ Database & tables synced successfully!"))
  .catch((err) => console.error("❌ Error syncing database:", err));


