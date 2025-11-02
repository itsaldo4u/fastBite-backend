import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import userRoutes from "./routes/usersRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import revenueRoutes from "./routes/revenueRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://fastbitee.netlify.app",
    credentials: true,
  })
);
app.use(express.json());

// 🔗 Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes);
app.use("/offers", offerRoutes);
app.use("/rewards", rewardRoutes);
app.use("/ratings", ratingRoutes);
app.use("/contact", contactRoutes);
app.use("/revenues", revenueRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
