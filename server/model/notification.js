const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },

  // Message Details
  type: {
    type: String,
    enum: [
      "order-confirmation",
      "payment-due",
      "payment-received",
      "shipping-update",
    ],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },

  // Delivery Method
  email: {
    sent: { type: Boolean, default: false },
    sentAt: { type: Date },
  },
  sms: {
    sent: { type: Boolean, default: false },
    sentAt: { type: Date },
  },

  // Status
  read: { type: Boolean, default: false },
  readAt: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
