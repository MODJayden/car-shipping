const InterestRate = require("../model/interestRate");

// Get all interest rates
const getAllInterestRates = async (req, res) => {
  try {
    const page = 1;
    const limit = 10;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Determine sort order
    

    // Execute query with pagination
    const interestRates = await InterestRate.find()
      .sort({createdAt: -1})
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination info
    const total = await InterestRate.countDocuments();

    res.json({
      success: true,
      count: interestRates.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: interestRates,
    });
  } catch (error) {
    console.log("Error occurred while fetching interest rates:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get interest rate by ID
const getInterestRateById = async (req, res) => {
  try {
    const interestRate = await InterestRate.findById(req.params.id);

    if (!interestRate) {
      return res.status(404).json({
        success: false,
        message: "Interest rate not found",
      });
    }

    res.json({
      success: true,
      data: interestRate,
    });
  } catch (error) {
    console.log("Error occurred while fetching interest rate:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid interest rate ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get interest rate by duration
const getInterestRateByDuration = async (req, res) => {
  try {
    const { duration } = req.params;

    // Validate duration
    const validDurations = [1, 2, 3];
    if (!validDurations.includes(Number(duration))) {
      return res.status(400).json({
        success: false,
        message: "Duration must be 1, 2, or 3 years",
      });
    }

    const interestRate = await InterestRate.findOne({
      duration: Number(duration),
      isActive: true,
    });

    if (!interestRate) {
      return res.status(404).json({
        success: false,
        message: `No active interest rate found for ${duration} year duration`,
      });
    }

    res.json({
      success: true,
      data: interestRate,
    });
  } catch (error) {
    console.log(
      "Error occurred while fetching interest rate by duration:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Create a new interest rate
const createInterestRate = async (req, res) => {
  try {
    const { duration, rate, isActive } = req.body;

    // Validate required fields
    if (!duration || rate === undefined) {
      return res.status(400).json({
        success: false,
        message: "Duration and rate are required",
      });
    }

    // Validate duration
    const validDurations = [1, 2, 3];
    if (!validDurations.includes(Number(duration))) {
      return res.status(400).json({
        success: false,
        message: "Duration must be 1, 2, or 3 years",
      });
    }

    // Validate rate
    if (rate <= 0 || rate > 100) {
      return res.status(400).json({
        success: false,
        message: "Rate must be between 0 and 100",
      });
    }

    // Check if interest rate for this duration already exists
    const existingRate = await InterestRate.findOne({
      duration: Number(duration),
    });
    if (existingRate) {
      return res.status(409).json({
        success: false,
        message: `Interest rate for ${duration} year duration already exists`,
      });
    }

    // Create the interest rate
    const interestRate = await InterestRate.create({
      duration: Number(duration),
      rate: Number(rate),
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: "Interest rate created successfully",
      data: interestRate,
    });
  } catch (error) {
    console.log("Error occurred while creating interest rate:", error.message);

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

// Update an interest rate
const updateInterestRate = async (req, res) => {
  try {
    const { rate, isActive } = req.body;

    // Validate at least one field to update
    if (rate === undefined && isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "At least one field (rate or isActive) must be provided",
      });
    }

    // Validate rate if provided
    if (rate !== undefined) {
      if (rate <= 0 || rate > 100) {
        return res.status(400).json({
          success: false,
          message: "Rate must be between 0 and 100",
        });
      }
    }

    // Build update object
    const updateData = {};
    if (rate !== undefined) updateData.rate = Number(rate);
    if (isActive !== undefined) updateData.isActive = isActive;
    updateData.updatedAt = new Date();

    // Find and update the interest rate
    const interestRate = await InterestRate.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!interestRate) {
      return res.status(404).json({
        success: false,
        message: "Interest rate not found",
      });
    }

    res.json({
      success: true,
      message: "Interest rate updated successfully",
      data: interestRate,
    });
  } catch (error) {
    console.log("Error occurred while updating interest rate:", error.message);

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
        message: "Invalid interest rate ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete an interest rate
const deleteInterestRate = async (req, res) => {
  try {
    const interestRate = await InterestRate.findByIdAndDelete(req.params.id);

    if (!interestRate) {
      return res.status(404).json({
        success: false,
        message: "Interest rate not found",
      });
    }

    res.json({
      success: true,
      message: "Interest rate deleted successfully",
    });
  } catch (error) {
    console.log("Error occurred while deleting interest rate:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid interest rate ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get active interest rates only
const getActiveInterestRates = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const interestRates = await InterestRate.find({ isActive: true })
      .sort({ duration: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await InterestRate.countDocuments({ isActive: true });

    res.json({
      success: true,
      count: interestRates.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: interestRates,
    });
  } catch (error) {
    console.log(
      "Error occurred while fetching active interest rates:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Calculate loan interest
const calculateLoanInterest = async (req, res) => {
  try {
    const { principal, duration } = req.body;

    // Validate required fields
    if (!principal || !duration) {
      return res.status(400).json({
        success: false,
        message: "Principal amount and duration are required",
      });
    }

    // Validate principal
    if (principal <= 0) {
      return res.status(400).json({
        success: false,
        message: "Principal amount must be greater than 0",
      });
    }

    // Validate duration
    const validDurations = [1, 2, 3];
    if (!validDurations.includes(Number(duration))) {
      return res.status(400).json({
        success: false,
        message: "Duration must be 1, 2, or 3 years",
      });
    }

    // Get interest rate for the duration
    const interestRate = await InterestRate.findOne({
      duration: Number(duration),
      isActive: true,
    });

    if (!interestRate) {
      return res.status(404).json({
        success: false,
        message: `No active interest rate found for ${duration} year duration`,
      });
    }

    // Calculate interest
    const interest = (principal * interestRate.rate * duration) / 100;
    const totalAmount = principal + interest;

    res.json({
      success: true,
      data: {
        principal,
        duration: `${duration} year(s)`,
        interestRate: `${interestRate.rate}%`,
        interest,
        totalAmount,
        monthlyPayment: totalAmount / (duration * 12),
      },
    });
  } catch (error) {
    console.log(
      "Error occurred while calculating loan interest:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllInterestRates,
  getInterestRateById,
  getInterestRateByDuration,
  createInterestRate,
  updateInterestRate,
  deleteInterestRate,
  getActiveInterestRates,
  calculateLoanInterest,
};
