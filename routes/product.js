// const express = require("express");
// const fs = require("fs");
// const router = express.Router();

// router.get("/", (req, res) => {
//     const products = JSON.parse(fs.readFileSync("data/products.json"));
//     res.json(products);
// });

// router.get("/:id", (req, res) => {
//     const products = JSON.parse(fs.readFileSync("data/products.json"));
//     const product = products.find((p) => p.id === parseInt(req.params.id));
//     if (product) {
//         res.json(product);
//     } else {
//         res.status(404).json({ error: "Product not found" });
//     }
// });

// router.post("/", (req, res) => {
//     const products = JSON.parse(fs.readFileSync("data/products.json"));
//     const newProduct = {
//         id: products.length ? products[products.length - 1].id + 1 : 1,
//         name: req.body.name,
//         price: req.body.price,
//         image: req.body.image
//     };
//     const updatedProducts = [...products, newProduct];
//     fs.writeFileSync("data/products.json", JSON.stringify(updatedProducts, null, 2));
//     res.status(201).json({message: "Product created successfully",product: newProduct});
// });

// router.delete("/:id", (req, res) => {
//     const products = JSON.parse(fs.readFileSync("data/products.json"));
//     const updatedProducts = products.filter(
//         (p) => p.id !== parseInt(req.params.id));
//     fs.writeFileSync("data/products.json", JSON.stringify(updatedProducts, null, 2));
//     res.json({ message: "Product deleted successfully" });
// });
// module.exports = router;

const express = require("express");
const Product = require("../models/Product");
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");

const router = express.Router();

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

router.post("/", auth, admin, async (req, res) => {
  try {
    const { name, price, image, category , subcategory} = req.body;

    if (!name || !price || !image || !category || !subcategory) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const product = await Product.create({
      name,
      price,
      image,
      category,
      subcategory
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

module.exports = router;




