const express = require("express");
const router = express.Router();
const {
  getAllInterestRates,
  getInterestRateById,
  getInterestRateByDuration,
  createInterestRate,
  updateInterestRate,
  deleteInterestRate,
  getActiveInterestRates,
  calculateLoanInterest,
} = require("../controller/interestRate");

// Public routes
router.get("/getAll", getAllInterestRates);
router.get("/active", getActiveInterestRates);
router.get("/get/:id", getInterestRateById);
router.get("/duration/:duration", getInterestRateByDuration);
router.post("/calculate", calculateLoanInterest);

// Protected routes (admin only)
router.post("/create", createInterestRate);
router.put("/update/:id", updateInterestRate);
router.delete("/delete/:id", deleteInterestRate);

module.exports = router;
