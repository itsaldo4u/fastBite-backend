// routes/products.js
import express from "express";
import Product from "../models/product.js";
import { nanoid } from "nanoid";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    // ✅ Mapo isNewProduct -> isNew për frontend
    const mapped = products.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category,
      discount: p.discount,
      isNew: p.isNewProduct, // Backend ka isNewProduct, frontend pret isNew
      isCombo: p.isCombo,
      rating: p.rating || 0,
      ratingCount: p.ratingCount || 0,
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new product
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description = "",
      price,
      image = "",
      category = "",
      discount = 0,
      isNew = false, // ✅ Merr isNew nga frontend
      isCombo = false,
      rating = 0,
      ratingCount = 0,
    } = req.body;

    if (!title || !price) {
      return res
        .status(400)
        .json({ message: "Titulli dhe Çmimi janë të detyrueshme" });
    }

    const newProduct = new Product({
      id: req.body.id || nanoid(8),
      title,
      description,
      price,
      image,
      category,
      discount,
      isNewProduct: isNew, // ✅ Ruaj si isNewProduct në DB
      isCombo,
      rating,
      ratingCount,
    });

    const saved = await newProduct.save();

    // ✅ Kthen të dhënat në formatin që pret frontend-i
    res.status(201).json({
      id: saved.id,
      title: saved.title,
      description: saved.description,
      price: saved.price,
      image: saved.image,
      category: saved.category,
      discount: saved.discount,
      isNew: saved.isNewProduct,
      isCombo: saved.isCombo,
      rating: saved.rating,
      ratingCount: saved.ratingCount,
    });
  } catch (err) {
    console.error("Gabim në krijimin e produktit:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update product
router.put("/:id", async (req, res) => {
  try {
    const { isNew, ...rest } = req.body;

    // ✅ Konverto isNew -> isNewProduct për backend
    const updateData = {
      ...rest,
      isNewProduct: isNew !== undefined ? isNew : undefined,
    };

    const updated = await Product.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Produkt nuk u gjet" });
    }

    // ✅ Kthen të dhënat në formatin që pret frontend-i
    res.json({
      id: updated.id,
      title: updated.title,
      description: updated.description,
      price: updated.price,
      image: updated.image,
      category: updated.category,
      discount: updated.discount,
      isNew: updated.isNewProduct,
      isCombo: updated.isCombo,
      rating: updated.rating,
      ratingCount: updated.ratingCount,
    });
  } catch (err) {
    console.error("Gabim gjatë përditësimit të produktit:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE product by frontend id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });

    if (!deleted) {
      return res.status(404).json({ message: "Produkt nuk u gjet" });
    }

    res.json({ message: "Produkt i fshirë" });
  } catch (err) {
    console.error("Gabim gjatë fshirjes së produktit:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
