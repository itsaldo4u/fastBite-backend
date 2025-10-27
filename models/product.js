// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true }, // ID unike për frontend (mund të jetë auto-generate ose nga frontend)
    title: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    category: { type: String, default: "" },
    discount: { type: Number, default: 0 },
    isNewProduct: { type: Boolean, default: false },
    isCombo: { type: Boolean, default: false },
    rating: { type: Number, default: 0 }, // vlerësimi fillestar
    ratingCount: { type: Number, default: 0 }, // opsionale: numri i vlerësimeve
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
