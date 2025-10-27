import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: String,
  address: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  password: { type: String, required: true },
});

const Auth = mongoose.model("Auth", authSchema);
export default Auth;
