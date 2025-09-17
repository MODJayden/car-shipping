const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema(
  {
    fromCountry: { type: String, required: true },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    toCountry: { type: String, required: true },
    estimatedDays: { type: Number, required: true },
    cost: { type: Number, required: true }, // Shipping cost in USD
    userId: {
      type: String,
      required: true,
    },
    // Tracking
    trackingNumber: { type: String },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "in-transit",
        "arrived",
        "delivered",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Shipping = mongoose.model("Shipping", shippingSchema);

module.exports = Shipping;
