import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Emri është i detyrueshëm."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email është i detyrueshëm."],
      trim: true,
      match: [/.+\@.+\..+/, "Email nuk është i vlefshëm."],
    },
    message: {
      type: String,
      required: [true, "Mesazhi është i detyrueshëm."],
      trim: true,
      minlength: [5, "Mesazhi duhet të përmbajë të paktën 5 karaktere."],
    },
  },
  {
    timestamps: true, // shton automatikisht createdAt dhe updatedAt
  }
);

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
