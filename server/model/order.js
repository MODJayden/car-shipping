const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      DateOfBirth: String,
    },
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Pricing
    carPrice: { type: Number, required: true },
    totalPricePaid: { type: Number, required: true },
    downPayment: { type: Number, default: 0 },

    // Payment Info
    paymentMethod: {
      type: String,
      enum: ["full-payment", "installment"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },

    // Order Status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // Customer Details
    deliveryAddress: {
      country: String,
      city: String,
      address: String,
      postalCode: String,
    },

    // Notifications
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
    },
    //paymentGateway: String,

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
