const Order = require("../models/Order");

// PLACE ORDER
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

    const order = await Order.create({
      user: req.userData.id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalAmount,
    });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET USER ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userData.id })
      .populate("items.productId");

    if (!orders) {
      return res.status(200).json([]);
    }

    const formattedOrders = orders.map((order) => ({
      id: order._id,
      status: order.orderStatus,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      orderedAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.productId?._id,
        name: item.productId?.name,
        price: item.price,
        quantity: item.qty,
        image: item.productId?.image,
      })),
      shippingAddress: order.shippingAddress,
    }));

    res.status(200).json(formattedOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN – UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated",
      status: order.orderStatus,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
