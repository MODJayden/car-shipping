const express = require("express");
const router = express.Router();
const {
  getAllNotifications,
  getNotificationById,
  getNotificationsByRecipient,
  createNotification,
  updateNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  getNotificationsByType,
} = require("../controller/notification");


// Public routes (some might need authentication in real app)
router.get("/getAll", getAllNotifications);
router.get("/get/:id", getNotificationById);
router.get("/recipient/:recipientId", getNotificationsByRecipient);
router.get("/type/:type", getNotificationsByType);
router.get("/unread-count/:recipientId", getUnreadCount);

// Protected routes
router.post("/create", createNotification);
router.put("/update/:id", updateNotification);
router.patch("/recipient/:recipientId/read-all", markAllAsRead);
router.patch("/patch/:id/read", markAsRead);
router.delete("/delete/:id", deleteNotification);

module.exports = router;
