import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    description: String,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);
