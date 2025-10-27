import express from "express";
import Contact from "../models/contact.js";

const router = express.Router();

// POST /contact
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validim bazik
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Të gjitha fushat janë të detyrueshme." });
    }

    // Krijo një mesazh të ri
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res
      .status(200)
      .json({ message: "Mesazhi u dërgua dhe u ruajt me sukses!" });
  } catch (error) {
    console.error("Gabim gjatë ruajtjes së mesazhit:", error);
    res.status(500).json({ error: "Gabim gjatë dërgimit të mesazhit." });
  }
});

export default router;
