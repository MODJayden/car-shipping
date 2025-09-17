const mongoose = require("mongoose");

const paymentPlanSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Plan Details
  planDuration: { type: Number, enum: [1, 2, 3], required: true }, // Years
  interestRate: { type: Number, required: true }, // Percentage
  monthlyPayment: { type: Number, required: true },
  totalPayments: { type: Number, required: true }, // Number of payments
  totalAmount: { type: Number, required: true }, // Total with interest

  // Auto-deduction
  autoDeduction: { type: Boolean, default: false },
  paymentMethod: {
    type: String,
    enum: ["bank-transfer", "credit-card", "mobile-money"],
    required: true,
  },

  // Payment Schedule
  nextPaymentDate: { type: Date, required: true },
  paymentDay: { type: Number, min: 1, max: 31 }, // Day of month for payments

  status: {
    type: String,
    enum: ["active", "completed", "defaulted", "cancelled"],
    default: "active",
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PaymentPlan = mongoose.model("PaymentPlan", paymentPlanSchema);

module.exports = PaymentPlan;
