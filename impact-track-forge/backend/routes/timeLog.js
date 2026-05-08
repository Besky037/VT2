import express from "express";
import TimeLog from "../models/TimeLog.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const logs = await TimeLog.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load timelogs" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { projectName, description, date, clockIn, clockOut, totalHours } = req.body;
    if (!projectName || !date || !clockIn || !clockOut || totalHours == null) {
      return res.status(400).json({ message: "Missing fields for timelog" });
    }

    const log = await TimeLog.create({
      user: req.userId,
      projectName,
      description: description || "",
      date,
      clockIn,
      clockOut,
      totalHours,
    });

    res.status(201).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create timelog" });
  }
});

export default router;
