const mongoose = require("mongoose");
const interestRateSchema = new mongoose.Schema(
  {
    duration: { type: Number, enum: [1, 2, 3], required: true }, // Years
    rate: { type: Number, required: true }, // Percentage
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const InterestRate = mongoose.model("InterestRate", interestRateSchema);

module.exports = InterestRate;
