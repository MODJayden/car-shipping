const express = require("express");
const router = express.Router();
const {
  getAllShippings,
  createShipping,
  updateShipping,
  getShippingUser,
} = require("../controller/shipping");

// Public routes
router.get("/getAll", getAllShippings);
router.get("/:userId", getShippingUser);

// Protected routes (admin only)
router.post("/create", createShipping);
router.put("/update/:id", updateShipping);

module.exports = router;
