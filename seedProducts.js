import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Product from "./models/Product.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // Lexo db.json
    const filePath = path.resolve("data/db.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);

    // Fshij produktet ekzistuese
    await Product.deleteMany();

    // Fut produktet
    await Product.insertMany(data.products);
    console.log("✅ Products seeded");

    process.exit();
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });
