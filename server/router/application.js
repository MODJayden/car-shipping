const express = require("express");
const router = express.Router();
const {
  createApplication,
  updateAmountPaid,
  updateStatus,
  deleteApplication,
  getAllApplications,
  getApplicationsByUser,
} = require("../controller/application");

// Routes
router.post("/create", createApplication);
router.patch("/update-amount/:id", updateAmountPaid);
router.patch("/update-status/:id", updateStatus);
router.delete("/delete/:id", deleteApplication);
router.get("/all", getAllApplications);
router.get("/user/:userId", getApplicationsByUser);

module.exports = router;
