import express from "express";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { auth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({ archived: false }).select("name description assignedUsers");
    const payload = projects.map((project) => ({
      id: project._id,
      name: project.name,
      description: project.description,
      volunteers: project.assignedUsers.length,
    }));
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load projects" });
  }
});

router.get("/admin", auth, requireAdmin, async (req, res) => {
  try {
    const projects = await Project.find().populate("assignedUsers", "name email");
    const payload = projects.map((project) => ({
      id: project._id,
      name: project.name,
      description: project.description,
      archived: project.archived,
      volunteers: project.assignedUsers.length,
      assignedUsers: project.assignedUsers,
    }));
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load admin projects" });
  }
});

router.post("/", auth, requireAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Project name is required" });

    const project = await Project.create({ name, description: description || "" });
    return res.status(201).json({ id: project._id, name: project.name, description: project.description, volunteers: 0, archived: project.archived });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create project" });
  }
});

router.patch("/:id/archive", auth, requireAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.archived = true;
    await project.save();
    return res.json({ message: "Project archived" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not archive project" });
  }
});

router.post("/:id/assign", auth, requireAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "User email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const alreadyAssigned = project.assignedUsers.some((id) => id.equals(user._id));
    if (!alreadyAssigned) {
      project.assignedUsers.push(user._id);
      await project.save();
    }

    return res.json({ message: "User assigned", assignedTo: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not assign project" });
  }
});

router.post("/:id/unassign", auth, requireAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "User email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.assignedUsers = project.assignedUsers.filter((id) => !id.equals(user._id));
    await project.save();

    return res.json({ message: "User unassigned", unassignedFrom: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not unassign user" });
  }
});

export default router;
