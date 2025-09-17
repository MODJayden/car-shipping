const mongoose = require("mongoose");

// 1. User Schema (Customers)
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    creditScore: { type: Number, default: 0 },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
