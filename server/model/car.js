const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    condition: {
      type: String,
      enum: ["new", "used", "excellent", "good", "fair"],
      required: true,
    },
    fuelType: {
      type: String,
      enum: ["gasoline", "diesel", "hybrid", "electric"],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["automatic", "manual"],
      required: true,
    },

    // Location & Pricing
    originCountry: {
      type: String,
      enum: ["USA", "Canada", "Europe", "Japan"],
      required: true,
    },

    price: { type: Number, required: true }, // Base price in USD
    currency: { type: String, default: "USD" },

    // Images & Documentation
    images: [{ type: String }], // Array of image URLs

    // Availability
    status: {
      type: String,
      enum: ["available", "sold", "reserved", "shipped"],
      default: "available",
    },

  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
