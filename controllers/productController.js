const Product = require("../models/Product");

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const { name, price, category, image } = req.body;

    if (!name || !price || !category || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const product = await Product.create({
      name,
      price,
      image,
      category,
      subcategory,
      createdBy: req.userData?.id,
    });

    res.status(201).json({
      message: "Product created successfully",
      product: {
        id: product._id,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL PRODUCTS (USED BY PRODUCTS PAGE)
const getProducts = async (req, res) => {
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
    res.status(400).json({ error: err.message });
  }
};

// GET PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      subcategory: product.subcategory,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        subcategory: product.category,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {createProduct, getProducts,getProductById, updateProduct,deleteProduct};
