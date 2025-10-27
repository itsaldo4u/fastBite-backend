import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// 🔐 Sekreti për JWT (vendose në .env)
const JWT_SECRET = process.env.JWT_SECRET || "sekret-shume-i-fshehte";

// --- Signup ---
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Ky email ekziston tashmë." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      address,
      role,
      password: hashedPassword,
    });

    await newUser.save();

    // Krijo token për login automatik pas signup
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    const userObj = newUser.toObject();
    userObj.id = userObj._id;
    delete userObj.password;

    res.status(201).json({ user: userObj, token });
  } catch (error) {
    console.error("Gabim gjatë regjistrimit:", error);
    res.status(500).json({ message: "Gabim gjatë regjistrimit.", error });
  }
});

// --- Login ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email ose fjalëkalim i pasaktë." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email ose fjalëkalim i pasaktë." });
    }

    // Krijo JWT Token që mban userId + role
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "2h",
    });

    const userObj = user.toObject();
    userObj.id = userObj._id;
    delete userObj.password;

    res.status(200).json({ user: userObj, token });
  } catch (error) {
    console.error("Gabim gjatë hyrjes:", error);
    res.status(500).json({ message: "Gabim gjatë hyrjes.", error });
  }
});

export default router;
