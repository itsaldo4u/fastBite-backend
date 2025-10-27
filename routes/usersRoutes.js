import express from "express";
import User from "../models/user.js";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    console.log("Users fetched:", users.length);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res
      .status(500)
      .json({ message: "Gabim në marrjen e përdoruesve", error: err });
  }
});

// POST create new user (signup)
router.post("/signup", async (req, res) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ message: "Email ekziston" });

    const newUser = new User(req.body);
    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë regjistrimit", error: err });
  }
});

// PUT update user
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gabim gjatë përditësimit të përdoruesit", error: err });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Përdoruesi u fshi" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gabim gjatë fshirjes së përdoruesit", error: err });
  }
});

export default router;
