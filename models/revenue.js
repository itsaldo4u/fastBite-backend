// models/revenue.js
import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true, // Një record për ditë
    },
    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index për kërkime më të shpejtë sipas datës
revenueSchema.index({ date: 1 });

const Revenue = mongoose.model("Revenue", revenueSchema);
export default Revenue;
