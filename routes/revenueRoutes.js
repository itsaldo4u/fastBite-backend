// routes/revenueRoutes.js
import express from "express";
import Revenue from "../models/revenue.js";

const router = express.Router();

// Merr të gjithë revenue (statistika sipas datës)
router.get("/", async (req, res) => {
  try {
    const revenue = await Revenue.find().sort({ date: -1 });
    res.json(revenue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim gjatë marrjes së të dhënave" });
  }
});

// Merr revenue për një periudhë specifike
router.get("/range", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const revenue = await Revenue.find(query).sort({ date: -1 });
    res.json(revenue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim gjatë marrjes së të dhënave" });
  }
});

export default router;
