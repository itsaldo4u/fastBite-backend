import mongoose from "mongoose";

// Schema e kuponëve
const couponSchema = new mongoose.Schema({
  id: { type: String, required: true },
  code: { type: String, required: true },
  discount: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
});

// Schema e reward
const rewardSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // userId është required
    points: { type: Number, default: 0 },
    coupons: [couponSchema],
    lastSpinDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Reward", rewardSchema);
