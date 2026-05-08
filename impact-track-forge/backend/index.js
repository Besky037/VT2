import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import timeLogRoutes from "./routes/timeLog.js";
import projectsRoutes from "./routes/projects.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(express.json());

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("MONGO_URI is not defined. Set it in server/.env");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.json({ message: "Impact Track Forge API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/timelogs", timeLogRoutes);
app.use("/api/projects", projectsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
