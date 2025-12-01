import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// GET - Merr të gjitha mesazhet (KY MUNGON!)
router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Gabim gjatë marrjes së mesazheve:", error);
    res.status(500).json({ error: "Gabim gjatë marrjes së mesazheve." });
  }
});

// POST - Krijo mesazh të ri
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Të gjitha fushat janë të detyrueshme." });
    }

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

// DELETE - Fshi një mesazh
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Contact.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ error: "Mesazhi nuk u gjet." });
    }

    res.status(200).json({ message: "Mesazhi u fshi me sukses!" });
  } catch (error) {
    console.error("Gabim gjatë fshirjes së mesazhit:", error);
    res.status(500).json({ error: "Gabim gjatë fshirjes së mesazhit." });
  }
});

export default router;
