const Order = require("../models/Order");
const Cart = require("../models/Cart");

/* CREATE ORDER */

exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalAmount,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Payment status logic
    const paymentStatus = paymentMethod === "COD" ? "Pending" : "Paid";

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      itemsPrice,
      shippingPrice,
      totalAmount,
    });

    // Clear cart after order
    await Cart.findOneAndDelete({ user: req.user.id });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* GET USER ORDERS */

exports.getMyOrders = async (req, res) => {
  try {

    const orders = await Order.find({ user: req.user.id })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map((order) => ({
      id: order._id,
      status: order.orderStatus,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount || order.itemsPrice,
      orderedAt: order.createdAt,

      items: order.items.map((item) => ({
        id: item.productId?._id,
        name: item.productId?.name || item.name,
        price: item.price,
        quantity: item.qty,
        image: item.productId?.image || item.image,
      })),

      shippingAddress: order.shippingAddress,
    }));

    res.status(200).json(formattedOrders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ADMIN - GET ALL ORDERS */

exports.getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* UPDATE ORDER STATUS */

exports.updateOrderStatus = async (req, res) => {
  try {

    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus;

    // Auto update payment when delivered for COD
    if (order.paymentMethod === "COD" && orderStatus === "Delivered") {
      order.paymentStatus = "Paid";
    }

    await order.save();

    res.status(200).json({
      message: "Order status updated",
      status: order.orderStatus,
      paymentStatus: order.paymentStatus,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};