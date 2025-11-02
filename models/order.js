// models/Order.js
import mongoose from "mongoose";
import { nanoid } from "nanoid";

// Schema për çdo item të porosisë
const orderItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, default: null },
    crust: { type: String, default: null },
    toppings: { type: [String], default: [] },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    paymentMethod: { type: String, required: true, enum: ["card", "cash"] },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Çmimi total nuk mund të jetë negativ"],
    },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    cardNumber: {
      type: String,
      required: function () {
        return this.paymentMethod === "card";
      },
      default: null,
      select: false,
    },
    expiryDate: {
      type: String,
      required: function () {
        return this.paymentMethod === "card";
      },
      default: null,
      select: false,
    },
    cvv: {
      type: String,
      required: function () {
        return this.paymentMethod === "card";
      },
      default: null,
      select: false,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v) => v && v.length > 0,
        message: "Porosia duhet të përmbajë të paktën një artikull.",
      },
    },
    originalPrice: { type: Number, default: 0 },
    couponUsed: { type: String, default: null },
    discount: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["pending", "preparing", "delivering", "delivered"],
      default: "pending",
    },
    startTime: { type: Date, default: null },
    prepTime: { type: Number, default: 0 },
    review: { type: String, default: "" },
    ratingMap: {
      type: Map,
      of: Number,
      default: {},
    },
    trackingId: {
      type: String,
      unique: true,
      default: () => nanoid(8),
    },
  },
  { timestamps: true }
);

// 🧹 Fshin automatikisht porositë pas 7 ditësh (604800 sekonda)
orderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

// Heq automatikisht fushat e pagesës kur metoda është 'cash'
orderSchema.pre("validate", function (next) {
  if (this.paymentMethod === "cash") {
    this.cardNumber = undefined;
    this.expiryDate = undefined;
    this.cvv = undefined;
  }
  next();
});

export default mongoose.model("Order", orderSchema);
