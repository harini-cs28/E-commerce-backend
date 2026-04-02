const express = require("express");
const Product = require("../models/Product");
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");

const router = express.Router();

/* ================= GET ALL PRODUCTS ================= */

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    const formattedProducts = products.map((p) => ({
      id: p._id,
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category,
      subcategory: p.subcategory,
    }));

    res.status(200).json(formattedProducts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET SINGLE PRODUCT ================= */

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      subcategory: product.subcategory,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= ADD PRODUCT (ADMIN ONLY) ================= */

router.post("/", auth, admin, async (req, res) => {
  try {
    const { name, price, image, category, subcategory } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        error: "Name and price are required",
      });
    }

    const product = await Product.create({
      name,
      price,
      image,
      category,
      subcategory,
    });

    res.status(201).json({
      message: "Product created successfully",
      product: {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        subcategory: product.subcategory,
      },
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================= DELETE PRODUCT (ADMIN ONLY) ================= */

router.delete("/:id", auth, admin, async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product deleted successfully",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;