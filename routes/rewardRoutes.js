import express from "express";
import Reward from "../models/Reward.js";

const router = express.Router();

// Helper: krijon reward default
const createDefaultReward = (userId) => ({
  userId,
  points: 0,
  coupons: [],
  lastSpinDate: null,
});

// GET rewards by userId
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: "userId is required" });

  try {
    let reward = await Reward.findOne({ userId });

    if (!reward) {
      reward = new Reward(createDefaultReward(userId));
      await reward.save();
      return res.status(201).json(reward);
    }

    res.json(reward);
  } catch (error) {
    console.error("Error fetching rewards:", error);
    res.status(500).json({ error: error.message });
  }
});

// CREATE reward for a user (mostly optional)
router.post("/", async (req, res) => {
  const { userId, points = 0, coupons = [], lastSpinDate = null } = req.body;
  if (!userId) return res.status(400).json({ message: "userId is required" });

  try {
    let reward = await Reward.findOne({ userId });

    if (!reward) {
      reward = new Reward({ userId, points, coupons, lastSpinDate });
      await reward.save();
      return res.status(201).json(reward);
    } else {
      return res.status(200).json(reward);
    }
  } catch (error) {
    console.error("Error creating reward:", error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH points, coupons, lastSpinDate (update reward)
router.patch("/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: "userId is required" });

  try {
    let reward = await Reward.findOne({ userId });

    if (!reward) {
      reward = new Reward(createDefaultReward(userId));
    }

    Object.keys(req.body).forEach((key) => {
      reward[key] = req.body[key];
    });

    await reward.save();
    res.json(reward);
  } catch (error) {
    console.error("Error updating reward:", error);
    res.status(500).json({ error: error.message });
  }
});

// MARK a coupon as used
router.put("/use-coupon/:userId/:couponId", async (req, res) => {
  const { userId, couponId } = req.params;
  if (!userId || !couponId)
    return res
      .status(400)
      .json({ message: "userId and couponId are required" });

  try {
    let reward = await Reward.findOne({ userId });
    if (!reward) reward = new Reward(createDefaultReward(userId));

    const coupon = reward.coupons.find((c) => c.id === couponId);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    coupon.used = true;
    await reward.save();
    res.json(reward);
  } catch (error) {
    console.error("Error marking coupon as used:", error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE lastSpinDate (spin wheel)
router.put("/spin/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: "userId is required" });

  try {
    let reward = await Reward.findOne({ userId });

    if (!reward) {
      reward = new Reward(createDefaultReward(userId));
    }

    // Opsionale: shto points kur bën spin
    const pointsEarned = Math.floor(Math.random() * 10) + 1; // shembull 1-10
    reward.points = (reward.points || 0) + pointsEarned;

    reward.lastSpinDate = new Date();
    await reward.save();
    res.json(reward);
  } catch (error) {
    console.error("Error updating lastSpinDate:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
