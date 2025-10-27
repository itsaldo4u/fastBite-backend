// models/rating.js
import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    productId: { type: String, required: true },
    productTitle: { type: String, required: true },
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Rating", ratingSchema);
