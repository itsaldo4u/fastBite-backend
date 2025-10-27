import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Auth from "./models/Auth.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const updatePasswords = async () => {
  try {
    const users = await Auth.find();
    for (const user of users) {
      // Kontrollo nëse password është tashmë hashed
      if (!user.password.startsWith("$2b$")) {
        const hashed = await bcrypt.hash(user.password, 10);
        user.password = hashed;
        await user.save();
        console.log(`Password i user ${user.email} u hash-ua`);
      }
    }
    console.log("Të gjithë user-at u përditësuan!");
  } catch (err) {
    console.error("Gabim gjatë përditësimit të user-ave:", err);
  } finally {
    mongoose.disconnect();
  }
};

updatePasswords();
