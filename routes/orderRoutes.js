import express from "express";
import Order from "../models/order.js";
import Revenue from "../models/revenue.js";

const router = express.Router();
/* -------------------------------------
   1. POST: Krijon porosi të re
------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      userId: req.body.userId ? String(req.body.userId) : null,
    };

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Porosia u krijua me sukses. 🎉",
      order: savedOrder,
    });
  } catch (err) {
    console.error("Gabim në krijimin e porosisë:", err);
    res.status(500).json({ message: "Gabim në krijimin e porosisë" });
  }
});

/* -------------------------------------
   2. GET: Merr të gjitha porositë ose sipas userId
------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Gabim në marrjen e porosive:", err);
    res
      .status(500)
      .json({ message: "Gabim në marrjen e porosive", error: err.message });
  }
});

/* -------------------------------------
   3. GET: Faturat e dorëzuara për një user
------------------------------------- */
router.get("/user-invoices/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const invoices = await Order.find({ userId, status: "delivered" }).sort({
      createdAt: -1,
    });
    res.json(invoices);
  } catch (err) {
    console.error("Gabim gjatë marrjes së faturave:", err);
    res
      .status(500)
      .json({ message: "Gabim gjatë marrjes së faturave", error: err.message });
  }
});

/* -------------------------------------
   4. GET: Gjurmimi i porosisë sipas trackingId
------------------------------------- */
router.get("/track/:trackingId", async (req, res) => {
  try {
    const { trackingId } = req.params;
    const order = await Order.findOne({ trackingId });

    if (!order)
      return res
        .status(404)
        .json({ message: "Porosia nuk u gjet me këtë tracking ID." });

    const {
      _id,
      name,
      email,
      phone,
      address,
      items,
      totalPrice,
      status,
      prepTime,
      startTime,
      createdAt,
    } = order;

    res.json({
      trackingId,
      order: {
        _id,
        name,
        email,
        phone,
        address,
        items,
        totalPrice,
        status,
        prepTime,
        startTime,
        createdAt,
      },
    });
  } catch (err) {
    console.error("Gabim gjatë gjurmimit të porosisë:", err);
    res.status(500).json({
      message: "Gabim gjatë gjurmimit të porosisë",
      error: err.message,
    });
  }
});

/* -------------------------------------
   5. PATCH: Përditëso vetëm statusin e porosisë (admin)
------------------------------------- */
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status mungon" });

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Porosia nuk u gjet." });

    // --- SHTESA PËR REVENUE: regjistro fitimin kur porosia dorëzohet ---
    if (status === "delivered") {
      const order = updatedOrder;
      const today = new Date().toISOString().slice(0, 10);
      const start = new Date(today);
      const end = new Date(start.getTime() + 86400000);

      await Revenue.findOneAndUpdate(
        { date: { $gte: start, $lt: end } },
        {
          $inc: { totalOrders: 1, totalRevenue: order.totalPrice },
        },
        { upsert: true, new: true }
      );
    }

    res.json({ message: "Statusi u ndryshua me sukses", order: updatedOrder });
  } catch (err) {
    console.error("Gabim gjatë ndryshimit të statusit:", err);
    res.status(500).json({
      message: "Gabim gjatë ndryshimit të statusit",
      error: err.message,
    });
  }
});

/* -------------------------------------
   6. PATCH: Përditëso vetëm review dhe rating (user)
------------------------------------- */
router.patch("/:id/review", async (req, res) => {
  try {
    const { review, ratingMap } = req.body;
    if (!review && !ratingMap)
      return res
        .status(400)
        .json({ message: "Duhet të jepni review ose rating." });

    const updateFields = {};
    if (review) updateFields.review = review;
    if (ratingMap) updateFields.ratingMap = ratingMap;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Porosia nuk u gjet." });

    res.json({
      message: "Review dhe rating u ruajtën me sukses.",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Gabim në ruajtjen e review:", err);
    res
      .status(500)
      .json({ message: "Gabim në ruajtjen e review", error: err.message });
  }
});

/* -------------------------------------
   7. GET: Merr një porosi të vetme sipas ID
------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Porosia nuk u gjet" });
    res.json(order);
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(400).json({ message: "ID e porosisë e pavlefshme." });
    console.error("Gabim gjatë marrjes së porosisë:", err);
    res
      .status(500)
      .json({ message: "Gabim gjatë marrjes së porosisë", error: err.message });
  }
});

/* -------------------------------------
   8. PUT: Përditëso të gjitha fushat e porosisë
------------------------------------- */
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Porosia nuk u gjet" });
    res.json(updatedOrder);
  } catch (err) {
    console.error("Gabim në përditësimin e porosisë:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Gabim në të dhënat e dërguara gjatë përditësimit.",
        errors: err.errors,
      });
    }
    res.status(500).json({
      message: "Gabim në përditësimin e porosisë",
      error: err.message,
    });
  }
});

/* -------------------------------------
   9. DELETE: Fshin porosinë
------------------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const result = await Order.findByIdAndDelete(req.params.id);
    if (!result)
      return res
        .status(404)
        .json({ message: "Porosia nuk u gjet dhe nuk u fshi." });
    res.json({ message: "Porosia u fshi me sukses." });
  } catch (err) {
    console.error("Gabim në fshirjen e porosisë:", err);
    res
      .status(500)
      .json({ message: "Gabim në fshirjen e porosisë", error: err.message });
  }
});

export default router;
