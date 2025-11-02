// routes/revenueRoutes.js
import express from "express";
import Revenue from "../models/revenue.js";

const router = express.Router();

// Merr të gjithë revenue
router.get("/", async (req, res) => {
  try {
    const revenue = await Revenue.find().sort({ createdAt: -1 });
    res.json(revenue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim gjatë marrjes së të dhënave" });
  }
});

export default router;
