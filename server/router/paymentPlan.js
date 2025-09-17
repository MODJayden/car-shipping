const express = require("express");
const router = express.Router();
const {
  getAllPaymentPlans,
  getPaymentPlanById,
  getPaymentPlansByCustomer,
  getPaymentPlansByOrder,
  createPaymentPlan,
  updatePaymentPlanStatus,
  updatePaymentPlan,
  deletePaymentPlan,
  getPaymentPlansByStatus,
  getUpcomingPayments,
  triggerAutomaticPayments,
} = require("../controller/paymentPlan");

// Public routes
router.get("/getAll", getAllPaymentPlans);
router.get("/get/:id", getPaymentPlanById);
router.get("/customer/:customerId", getPaymentPlansByCustomer);
router.get("/order/:orderId", getPaymentPlansByOrder);
router.get("/status/:status", getPaymentPlansByStatus);
router.get("/upcoming/payments", getUpcomingPayments);

// Protected routes
router.post("create/", createPaymentPlan);
router.patch("/update/plan/status/:id", updatePaymentPlanStatus);
router.put("/payment-plan/:id", updatePaymentPlan);
router.delete("/delete/:id", deletePaymentPlan);

// Admin only routes
router.post("/process-payments", triggerAutomaticPayments);

module.exports = router;
