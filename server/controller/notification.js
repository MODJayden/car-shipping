const Notification = require("../model/notification");
const User = require("../model/user");

// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const {
      recipient,
      type,
      read,
      emailSent,
      smsSent,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (recipient) filter.recipient = recipient;
    if (order) filter.order = order;
    if (type) filter.type = type;
    if (read !== undefined) filter.read = read === "true";
    if (emailSent !== undefined) filter["email.sent"] = emailSent === "true";
    if (smsSent !== undefined) filter["sms.sent"] = smsSent === "true";

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Determine sort order
    const sortOrder = order === "desc" ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    // Execute query with pagination
    const notifications = await Notification.find(filter)
      .populate("recipient", "firstName lastName email phone")
      .populate("order", "orderNumber status")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination info
    const total = await Notification.countDocuments(filter);

    res.json({
      success: true,
      count: notifications.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: notifications,
    });
  } catch (error) {
    console.log("Error occurred while fetching notifications:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get notification by ID
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate("recipient", "firstName lastName email phone")
      .populate("order", "orderNumber status");

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.log("Error occurred while fetching notification:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get notifications by recipient
const getNotificationsByRecipient = async (req, res) => {
  try {
    const { recipientId } = req.params;

    // Build filter object
    const filter = { recipient: recipientId };

    // Calculate skip for pagination

    const notifications = await Notification.find(filter)
      .populate("order", "orderNumber status")
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({
      recipient: recipientId,
      read: false,
    });

    res.json({
      success: true,
      count: notifications?.length,
      total,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    console.log(
      "Error occurred while fetching notifications by recipient:",
      error.message
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid recipient ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { recipient, order, type, title, message, emailSent, smsSent } =
      req.body;

    // Validate required fields
    if (!recipient || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "Recipient, type, title, and message are required",
      });
    }

    // Validate recipient exists
    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return res.status(404).json({
        success: false,
        message: "Recipient user not found",
      });
    }

    // Validate type
    const validTypes = [
      "order-confirmation",
      "payment-due",
      "payment-received",
      "shipping-update",
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Type must be one of: ${validTypes.join(", ")}`,
      });
    }

    // Create the notification
    const notification = await Notification.create({
      recipient,
      order: order || null,
      type,
      title,
      message,
      email: {
        sent: emailSent || false,
        sentAt: emailSent ? new Date() : null,
      },
      sms: {
        sent: smsSent || false,
        sentAt: smsSent ? new Date() : null,
      },
    });

    // Populate the created notification
    const populatedNotification = await Notification.findById(notification._id)
      .populate("recipient", "firstName lastName email phone")
      .populate("order", "orderNumber status");

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: populatedNotification,
    });
  } catch (error) {
    console.log("Error occurred while creating notification:", error.message);

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

// Update a notification (mark as read, update delivery status)
const updateNotification = async (req, res) => {
  try {
    const { read, emailSent, smsSent } = req.body;

    // Validate at least one field to update
    if (
      read === undefined &&
      emailSent === undefined &&
      smsSent === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field (read, emailSent, or smsSent) must be provided",
      });
    }

    // Build update object
    const updateData = {};

    if (read !== undefined) {
      updateData.read = read;
      updateData.readAt = read ? new Date() : null;
    }

    if (emailSent !== undefined) {
      updateData["email.sent"] = emailSent;
      updateData["email.sentAt"] = emailSent ? new Date() : null;
    }

    if (smsSent !== undefined) {
      updateData["sms.sent"] = smsSent;
      updateData["sms.sentAt"] = smsSent ? new Date() : null;
    }

    // Find and update the notification
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("recipient", "firstName lastName email phone")
      .populate("order", "orderNumber status");

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification updated successfully",
      data: notification,
    });
  } catch (error) {
    console.log("Error occurred while updating notification:", error.message);

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
        message: "Invalid notification ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        read: true,
        readAt: new Date(),
      },
      { new: true, runValidators: true }
    ).populate("order", "orderNumber status");

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.log(
      "Error occurred while marking notification as read:",
      error.message
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Mark all notifications as read for a user
const markAllAsRead = async (req, res) => {
  try {
    const { recipientId } = req.params;

    // Validate recipient exists
    const recipientUser = await User.findById(recipientId);
    if (!recipientUser) {
      return res.status(404).json({
        success: false,
        message: "Recipient user not found",
      });
    }

    const result = await Notification.updateMany(
      { recipient: recipientId, read: false },
      {
        read: true,
        readAt: new Date(),
      }
    ).populate("order", "orderNumber status")

    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.log(
      "Error occurred while marking all notifications as read:",
      error.message
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid recipient ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.log("Error occurred while deleting notification:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get unread notifications count for a user
const getUnreadCount = async (req, res) => {
  try {
    const { recipientId } = req.params;

    // Validate recipient exists
    const recipientUser = await User.findById(recipientId);
    if (!recipientUser) {
      return res.status(404).json({
        success: false,
        message: "Recipient user not found",
      });
    }

    const count = await Notification.countDocuments({
      recipient: recipientId,
      read: false,
    });

    res.json({
      success: true,
      data: {
        recipient: recipientId,
        unreadCount: count,
      },
    });
  } catch (error) {
    console.log("Error occurred while fetching unread count:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid recipient ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get notifications by type
const getNotificationsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { recipient, page = 1, limit = 10 } = req.query;

    // Validate type
    const validTypes = [
      "order-confirmation",
      "payment-due",
      "payment-received",
      "shipping-update",
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Type must be one of: ${validTypes.join(", ")}`,
      });
    }

    // Build filter object
    const filter = { type };

    if (recipient) filter.recipient = recipient;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    const notifications = await Notification.find(filter)
      .populate("recipient", "firstName lastName email phone")
      .populate("order", "orderNumber status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Notification.countDocuments(filter);

    res.json({
      success: true,
      count: notifications.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: notifications,
    });
  } catch (error) {
    console.log(
      "Error occurred while fetching notifications by type:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
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
};
