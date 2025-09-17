const express = require("express");
 
const { initializePayment, verifyPayment } = require("../controller/payment");

const router = express.Router();

router.post("/paystack/initialize", initializePayment);
router.get("/paystack/verify/:reference", verifyPayment);

module.exports = router;
