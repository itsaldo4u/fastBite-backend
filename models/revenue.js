// models/Revenue.js
import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  items: [
    {
      title: String,
      quantity: Number,
      price: Number,
    },
  ],
});

export default mongoose.model("Revenue", revenueSchema);
