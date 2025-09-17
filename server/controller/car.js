const Car = require("../model/car");

// Get all cars
const getAllCars = async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build filter object
    const filters = {};

    // Add search filter if provided
    if (search) {
      filters.$or = [
        { make: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { color: { $regex: search, $options: "i" } },
      ];
    }

    // Add other filters from query parameters
    if (req.query.make && req.query.make !== "all") {
      filters.make = { $regex: req.query.make, $options: "i" };
    }

    if (req.query.originCountry && req.query.originCountry !== "all") {
      filters.originCountry = req.query.originCountry;
    }

    if (req.query.fuelType && req.query.fuelType !== "all") {
      filters.fuelType = req.query.fuelType;
    }

    if (req.query.transmission && req.query.transmission !== "all") {
      filters.transmission = req.query.transmission;
    }

    if (req.query.condition && req.query.condition !== "all") {
      filters.condition = req.query.condition;
    }

    if (req.query.status && req.query.status !== "all") {
      filters.status = req.query.status;
    }

    // Handle price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.$gte = parseInt(req.query.minPrice);
      if (req.query.maxPrice) filters.price.$lte = parseInt(req.query.maxPrice);
    }

    // Handle year filter
    if (req.query.minYear || req.query.maxYear) {
      filters.year = {};
      if (req.query.minYear) filters.year.$gte = parseInt(req.query.minYear);
      if (req.query.maxYear) filters.year.$lte = parseInt(req.query.maxYear);
    }

    // Determine sort order
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    // Execute query with pagination and filters
    const cars = await Car.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination info
    const total = await Car.countDocuments(filters);

    res.json({
      success: true,
      count: cars.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: cars,
    });
  } catch (error) {
    console.log("Error occurred while fetching cars:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Get car by ID
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.json({
      success: true,
      data: car,
    });
  } catch (error) {
    console.log("Error occurred while fetching car:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Create a new car
const createCar = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      color,
      condition,
      fuelType,
      transmission,
      originCountry,
      price,
      currency,
      images,
      status,
    } = req.body;

    // Validate required fields
    if (
      !make ||
      !model ||
      !year ||
      !color ||
      !condition ||
      !fuelType ||
      !transmission ||
      !originCountry ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 1) {
      return res.status(400).json({
        success: false,
        message: `Year must be between 1900 and ${currentYear + 1}`,
      });
    }

    // Validate price
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }

    // Create the car
    const car = await Car.create({
      make,
      model,
      year,
      color,
      condition,
      fuelType,
      transmission,
      originCountry,
      price,
      currency: currency || "USD",
      images: images || [],
      status: status || "available",
    });

    res.status(201).json({
      success: true,
      message: "Car created successfully",
      data: car,
    });
  } catch (error) {
    console.log("Error occurred while creating car:", error.message);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update a car
const updateCar = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      color,
      condition,
      fuelType,
      transmission,
      originCountry,
      price,
      currency,
      images,
      status,
    } = req.body;

    // Validate year if provided
    if (year) {
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear + 1) {
        return res.status(400).json({
          success: false,
          message: `Year must be between 1900 and ${currentYear + 1}`,
        });
      }
    }

    // Validate price if provided
    if (price && price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }

    // Build update object
    const updateData = {};
    if (make) updateData.make = make;
    if (model) updateData.model = model;
    if (year) updateData.year = year;
    if (color) updateData.color = color;
    if (condition) updateData.condition = condition;
    if (fuelType) updateData.fuelType = fuelType;
    if (transmission) updateData.transmission = transmission;
    if (originCountry) updateData.originCountry = originCountry;
    if (price) updateData.price = price;
    if (currency) updateData.currency = currency;
    if (images) updateData.images = images;
    if (status) updateData.status = status;

    // Find and update the car
    const car = await Car.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.json({
      success: true,
      message: "Car updated successfully",
      data: car,
    });
  } catch (error) {
    console.log("Error occurred while updating car:", error.message);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete a car
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.log("Error occurred while deleting car:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get cars by make
const getCarsByMake = async (req, res) => {
  try {
    const { make } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const cars = await Car.find({
      make: { $regex: make, $options: "i" },
    })
      .skip(skip)
      .limit(Number(limit));

    const total = await Car.countDocuments({
      make: { $regex: make, $options: "i" },
    });

    res.json({
      success: true,
      count: cars.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: cars,
    });
  } catch (error) {
    console.log("Error occurred while fetching cars by make:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get cars by condition
const getCarsByCondition = async (req, res) => {
  try {
    const { condition } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const cars = await Car.find({ condition }).skip(skip).limit(Number(limit));

    const total = await Car.countDocuments({ condition });

    res.json({
      success: true,
      count: cars.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: cars,
    });
  } catch (error) {
    console.log(
      "Error occurred while fetching cars by condition:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getCarsByMake,
  getCarsByCondition,
};
