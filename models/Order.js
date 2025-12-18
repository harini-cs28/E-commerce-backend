const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        price: Number,
        qty: Number,
        image: String,
      },
    ],

    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      pincode: String,
    },

    paymentMethod: {
      type: String,
      default: "COD", // COD / UPI / Card
    },

    paymentStatus: {
      type: String,
      default: "Pending", // Pending / Paid
    },

    orderStatus: {
      type: String,
      default: "Placed", // Placed / Shipped / Delivered / Cancelled
    },

    itemsPrice: Number,
    shippingPrice: Number,
    totalAmount: Number,

    orderedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
