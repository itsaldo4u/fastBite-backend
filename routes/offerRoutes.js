import express from "express";
import Offer from "../models/Offer.js";

const router = express.Router();

// GET all offers
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gabim në marrjen e ofertave", error: err });
  }
});

// POST create offer
router.post("/", async (req, res) => {
  try {
    const newOffer = new Offer(req.body);
    const saved = await newOffer.save();
    res.status(201).json(saved);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gabim në krijimin e ofertës", error: err });
  }
});

// PUT update offer
router.put("/:id", async (req, res) => {
  try {
    const { _id, ...data } = req.body;
    const updated = await Offer.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gabim në përditësimin e ofertës", error: err });
  }
});

// DELETE offer
router.delete("/:id", async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: "Oferta u fshi" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gabim në fshirjen e ofertës", error: err });
  }
});

export default router;
