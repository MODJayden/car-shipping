const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true },
});

// Employment Info Schema
const employmentInfoSchema = new Schema({
  employer: { type: String, default: "" },
  monthlyIncome: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ["employed", "self-employed", "unemployed", "student", "retired"],
  },
  yearsEmployed: { type: String, required: true },
});

// Notifications Schema
const notificationsSchema = new Schema({
  email: { type: Boolean, default: true },
  sms: { type: Boolean, default: true },
});

// Payment Plan Schema (only if installment plan)
const paymentPlanSchema = new Schema({
  autoDeduction: { type: Boolean, default: false },
  interestRate: { type: Number, required: true },
  monthlyPayment: { type: Number, required: true },
  nextPaymentDate: { type: Date, required: true },
  paymentDay: { type: Number, required: true, min: 1, max: 31 },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["bank-transfer", "direct-debit", "card", "cash"],
  },
  planDuration: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ["active", "completed", "cancelled", "defaulted"],
  },
  totalAmount: { type: Number, required: true },
  totalPayments: { type: Number, required: true },
});

// User Schema (embedded directly inside application)
const userSchema = new Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
});

// Order Schema (all order-related fields grouped here)
const orderSchema = new Schema({
  car: { type: Schema.Types.ObjectId, ref: "Car", required: true },
  carPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  downPayment: { type: Number, default: 0 },
  paymentMethod: {
    type: String,
    enum: ["installment", "full-payment"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  status: {
    type: String,
    enum: [
      "pending",
      "approved",
      "rejected",
      "processing",
      "completed",
      "cancelled",
    ],
    default: "pending",
  },
  deliveryAddress: { type: addressSchema, required: true },
  notifications: { type: notificationsSchema, default: () => ({}) },
});

// Main Application Schema
const applicationSchema = new Schema(
  {
    user: { type: userSchema, required: true },
    order: { type: orderSchema, required: true },
    paymentPlan: { type: paymentPlanSchema, required: false },
    employmentInfo: { type: employmentInfoSchema, required: false },
    amountPaid: { type: Number, default: 0 },
    userId: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "processing", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
