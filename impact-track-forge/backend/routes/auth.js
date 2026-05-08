import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { auth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: "volunteer",
    });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "JWT secret missing" });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, secret, { expiresIn: "7d" });

    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "JWT secret missing" });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, secret, { expiresIn: "7d" });

    return res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login failed" });
  }
});

router.get("/volunteers", auth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: "volunteer" }).select("name email role");
    const payload = await Promise.all(
      users.map(async (user) => {
        const assignedProjects = await Project.countDocuments({ assignedUsers: user._id });
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          totalHours: 0, // TODO: calculate from timelogs
          assignedProjects,
        };
      })
    );
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load volunteers" });
  }
});

export default router;
