// routes/rating.js
import express from "express";
import Rating from "../models/rating.js";
import Product from "../models/product.js";

const router = express.Router();

// GET të gjitha ratings
router.get("/", async (req, res) => {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET mesatare rating për produkt nga productId
router.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const ratings = await Rating.find({ productId });

    if (ratings.length === 0) {
      return res.json({ averageRating: 0, ratingCount: 0 });
    }

    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = total / ratings.length;

    res.json({
      averageRating: parseFloat(averageRating.toFixed(1)),
      ratingCount: ratings.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST një review/rating të ri
router.post("/", async (req, res) => {
  console.log("📥 Received rating data:", req.body);

  const { userId, orderId, productId, productTitle, name, comment, rating } =
    req.body;

  if (
    !userId ||
    !orderId ||
    !productId ||
    !productTitle ||
    !name ||
    !comment ||
    !rating
  ) {
    console.error("❌ Missing fields:", {
      userId: !!userId,
      orderId: !!orderId,
      productId: !!productId,
      productTitle: !!productTitle,
      name: !!name,
      comment: !!comment,
      rating: !!rating,
    });
    return res.status(400).json({
      message: "Të gjitha fushat janë të detyrueshme",
      received: {
        userId,
        orderId,
        productId,
        productTitle,
        name,
        comment,
        rating,
      },
    });
  }

  try {
    // 1️⃣ Ruaj rating-un e ri
    const newRating = new Rating({
      userId,
      orderId,
      productId,
      productTitle,
      name,
      comment,
      rating: Number(rating),
    });

    const saved = await newRating.save();
    console.log("✅ Rating saved:", saved._id);

    // 2️⃣ Merr TË GJITHA ratings për këtë produkt (duke përfshirë të rejën)
    const allRatings = await Rating.find({ productId });
    console.log(
      `📊 Total ratings for product ${productId}: ${allRatings.length}`
    );

    // 3️⃣ Llogarit mesataren nga të gjitha ratings
    const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allRatings.length;

    console.log(
      `📈 New average rating: ${averageRating.toFixed(1)} (from ${
        allRatings.length
      } ratings)`
    );

    // 4️⃣ Përditëso Product me mesataren e re dhe numrin e ratings
    const updatedProduct = await Product.findOneAndUpdate(
      { id: productId },
      {
        rating: parseFloat(averageRating.toFixed(1)),
        ratingCount: allRatings.length,
      },
      { new: true }
    );

    if (!updatedProduct) {
      console.warn(`⚠️ Product with id ${productId} not found`);
    } else {
      console.log(
        `✅ Product updated: rating=${updatedProduct.rating}, count=${updatedProduct.ratingCount}`
      );
    }

    res.status(201).json({
      message: "Rating u ruajt me sukses",
      rating: saved,
      productRating: {
        averageRating: parseFloat(averageRating.toFixed(1)),
        ratingCount: allRatings.length,
      },
    });
  } catch (err) {
    console.error("❌ Error saving rating:", err);
    res.status(500).json({ message: err.message, error: err.toString() });
  }
});

// DELETE një review
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Rating.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Vlerësimi nuk u gjet" });
    }

    console.log(`🗑️ Rating deleted: ${req.params.id}`);

    // Rikalkulo mesataren e produktit pas fshirjes
    const remainingRatings = await Rating.find({
      productId: deleted.productId,
    });

    const averageRating =
      remainingRatings.length > 0
        ? remainingRatings.reduce((sum, r) => sum + r.rating, 0) /
          remainingRatings.length
        : 0;

    console.log(
      `📊 Remaining ratings: ${
        remainingRatings.length
      }, new average: ${averageRating.toFixed(1)}`
    );

    // Përditëso Product
    await Product.findOneAndUpdate(
      { id: deleted.productId },
      {
        rating: parseFloat(averageRating.toFixed(1)),
        ratingCount: remainingRatings.length,
      }
    );

    res.json({
      message: "Vlerësimi u fshi me sukses",
      productRating: {
        averageRating: parseFloat(averageRating.toFixed(1)),
        ratingCount: remainingRatings.length,
      },
    });
  } catch (err) {
    console.error("❌ Error deleting rating:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
