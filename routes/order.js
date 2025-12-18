const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getMyOrders);
router.put("/:id/status", authMiddleware, updateOrderStatus);

module.exports = router;
