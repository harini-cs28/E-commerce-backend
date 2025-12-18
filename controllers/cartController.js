const Cart = require("../models/Cart");

/* =======================
   GET CART
======================= */
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "products.product"
    );

    if (!cart) {
      return res.status(200).json([]);
    }

    // ✅ FORMAT DATA FOR FRONTEND
    const formattedCart = cart.products.map((item) => ({
      id: item._id, // cart item id
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      qty: item.quantity,
    }));

    res.status(200).json(formattedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =======================
   ADD TO CART
======================= */
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId required" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        products: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
    }

    res.status(200).json({ message: "Added to cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =======================
   UPDATE QUANTITY
======================= */
const updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.products.id(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.quantity = quantity;
    await cart.save();

    res.json({ message: "Quantity updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =======================
   REMOVE ITEM
======================= */
const removeItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = cart.products.filter(
      (p) => p._id.toString() !== req.params.id
    );

    await cart.save();

    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {getCart,addToCart,updateQuantity,removeItem};
