const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  getAllOrders
} = require("../controllers/orderController");

// Create order (User)
router.post("/", authMiddleware, createOrder);

// Get logged-in user orders
router.get("/", authMiddleware, getMyOrders);

// Get all orders (Admin)
router.get("/admin", authMiddleware, getAllOrders);

// Update order status (Admin)
router.put("/:id/status", authMiddleware, updateOrderStatus);

module.exports = router;