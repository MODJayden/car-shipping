const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  getOrderForUser,
  getOrdersByCustomer,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  updateOrderShipping,
  updateOrder,
  deleteOrder,
  getOrdersByStatus,
  getOrdersByPaymentStatus,
} = require("../controller/order");

// Public routes
router.get("/getAll", getAllOrders);
router.get("/get/:id", getOrderById);
router.get("/user/orders/:userId", getOrderForUser);
router.get("/customer/:customerId", getOrdersByCustomer);
router.get("/status/:status", getOrdersByStatus);
router.get("/payment-status/:paymentStatus", getOrdersByPaymentStatus);

// Protected routes
router.post("/create", createOrder);
router.patch("/patch/:id/status", updateOrderStatus);
router.patch("/update/shipping/:id", updateOrderShipping);
router.put("/order/update:id", updateOrder);
router.delete("/delete/:id", deleteOrder);

module.exports = router;
