const Shipping = require("../model/shipping");
const Order = require("../model/order");
const Notification = require("../model/notification");
const sendEmail = require("../utils/sendEmail");
const mongoose = require("mongoose");

// Get all shipping records
const getAllShippings = async (req, res) => {
  try {
    const shippings = await Shipping.find()
      .sort({ createdAt: -1 })
      .populate("orderId");

    // Get total count for pagination info
    const total = await Shipping.countDocuments();

    res.json({
      success: true,
      count: shippings.length,
      total,
      data: shippings,
    });
  } catch (error) {
    console.log(
      "Error occurred while fetching shipping records:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getShippingUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find shipping records by ObjectId
    const shipping = await Shipping.find({ userId })
      .sort({ createdAt: -1 })
      .populate("orderId");
    console.log(shipping);

    if (!shipping || shipping.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No shipping records found for this user",
      });
    }

    res.json({
      success: true,
      data: shipping,
    });
  } catch (error) {
    console.log(
      "Error occurred while fetching shipping record:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Create a new shipping record
const createShipping = async (req, res) => {
  try {
    const {
      fromCountry,
      toCountry,
      orderId,
      estimatedDays,
      userId,
      cost,
      trackingNumber,
      status,
    } = req.body;

    // Validate required fields
    if (!fromCountry || !toCountry || !estimatedDays || !cost) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields must be provided (fromCountry, toCountry, estimatedDays, cost)",
      });
    }

    // Validate estimated days
    if (estimatedDays <= 0) {
      return res.status(400).json({
        success: false,
        message: "Estimated days must be greater than 0",
      });
    }

    // Validate cost
    if (cost <= 0) {
      return res.status(400).json({
        success: false,
        message: "Cost must be greater than 0",
      });
    }

    // Create the shipping record
    const shipping = await Shipping.create({
      fromCountry,
      toCountry,
      estimatedDays,
      cost,
      orderId,
      trackingNumber,
      status,
      userId,
    });
    // ✅ Create in-app notification
    await Notification.create({
      recipient: userId,
      order: orderId,
      type: "shipping-update",
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your Shipping record has been updated to: ${status}.`,
      email: { sent: true, sentAt: new Date() },
    });

    if (shipping) {
      //update order status
      const order = await Order.findById(orderId);
      if (order) {
        order.status = "shipped";
        await order.save();
      }
    }
    const populatedShipping = await Shipping.findById(shipping._id).populate(
      "orderId"
    );

    // ✅ Email subject & body mapping
    const emailTemplates = {
      pending: {
        subject: `⏳ Order #${shipping._id} is Pending`,
        body: `<p>Your order has been placed and is awaiting confirmation.</p>`,
      },
      confirmed: {
        subject: `✅ Order #${shipping._id} Confirmed`,
        body: `<p>Your order has been confirmed. We’ll start processing it shortly.</p>`,
      },
      processing: {
        subject: `⚙️ Order #${shipping._id} is Being Processed`,
        body: `<p>We are preparing your car for shipment. You’ll be notified once it’s shipped.</p>`,
      },
      shipped: {
        subject: `🚚 Order #${shipping._id} Shipped`,
        body: `<p>Your order is on the way! You’ll receive delivery details soon.</p>`,
      },
      delivered: {
        subject: `🎉 Order #${shipping._id} Delivered`,
        body: `<p>Your car has been delivered. Enjoy your new ride 🚗!</p>`,
      },
      cancelled: {
        subject: `⚠️ Order #${shipping._id} Cancelled`,
        body: `<p>Your order has been cancelled. If you believe this is a mistake, please contact support.</p>`,
      },
    };

    const template = emailTemplates[status];

    // ✅ Send email if customer exists
    if (populatedShipping.customer && populatedShipping.customer.email) {
      await sendEmail({
        to: populatedShipping.customer.email,
        subject: template.subject,
        html: `
              <h2>Hello ${populatedShipping.customer.firstName} ${populatedShipping.customer.lastName},</h2>
              <p>Here’s the latest update on your order:</p>
              <p><b>Order ID:</b> ${populatedShipping._id}</p>
              <p><b>Car:</b> ${populatedShipping.car.make} ${populatedShipping.car.model}</p>
              ${template.body}
              <br/>
              <p>— The Car Shop Team</p>
            `,
      });
    }

    res.status(201).json({
      success: true,
      message: "Shipping record created successfully",
      data: shipping,
    });
  } catch (error) {
    console.log(
      "Error occurred while creating shipping record:",
      error.message
    );
  }
};

// Update shipping record (admin only - full update)
const updateShipping = async (req, res) => {
  try {
    const {
      fromCountry,
      toCountry,
      estimatedDays,
      cost,
      trackingNumber,
      status,
    } = req.body;

    // Validate estimated days if provided
    if (estimatedDays && estimatedDays <= 0) {
      return res.status(400).json({
        success: false,
        message: "Estimated days must be greater than 0",
      });
    }

    // Validate cost if provided
    if (cost && cost <= 0) {
      return res.status(400).json({
        success: false,
        message: "Cost must be greater than 0",
      });
    }

    // Validate status if provided
    if (status) {
      const allowedStatuses = [
        "pending",
        "processing",
        "shipped",
        "in-transit",
        "arrived",
        "delivered",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status must be one of: ${allowedStatuses.join(", ")}`,
        });
      }
    }

    // Build update object
    const updateData = {};
    if (fromCountry) updateData.fromCountry = fromCountry;
    if (toCountry) updateData.toCountry = toCountry;
    if (estimatedDays) updateData.estimatedDays = estimatedDays;
    if (cost) updateData.cost = cost;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (status) updateData.status = status;

    // Find and update the shipping record
    const shipping = await Shipping.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("orderId");

    const order = await Order.findById(shipping.orderId);
    if (shipping.status === "delivered") {
      order.status = "delivered";
      await order.save();
    } else {
      order.status = "shipped";
    }
    // ✅ Create in-app notification
    await Notification.create({
      recipient: shipping.userId,
      order: shipping.orderId,
      type: "shipping-update",
      title: `Shipping ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your Shipping record has been updated to: ${status}.`,
      email: { sent: true, sentAt: new Date() },
    });

    const populatedShipping = await Shipping.findById(shipping._id).populate(
      "orderId"
    );
    // ✅ Email subject & body mapping
    const emailTemplates = {
      pending: {
        subject: `⏳ Order #${shipping._id} is Pending`,
        body: `<p>Your order has been placed and is awaiting confirmation.</p>`,
      },
      confirmed: {
        subject: `✅ Order #${shipping._id} Confirmed`,
        body: `<p>Your order has been confirmed. We’ll start processing it shortly.</p>`,
      },
      processing: {
        subject: `⚙️ Order #${shipping._id} is Being Processed`,
        body: `<p>We are preparing your car for shipment. You’ll be notified once it’s shipped.</p>`,
      },
      shipped: {
        subject: `🚚 Order #${shipping._id} Shipped`,
        body: `<p>Your order is on the way! You’ll receive delivery details soon.</p>`,
      },
      delivered: {
        subject: `🎉 Order #${shipping._id} Delivered`,
        body: `<p>Your car has been delivered. Enjoy your new ride 🚗!</p>`,
      },
      cancelled: {
        subject: `⚠️ Order #${shipping._id} Cancelled`,
        body: `<p>Your order has been cancelled. If you believe this is a mistake, please contact support.</p>`,
      },
    };

    const template = emailTemplates[status];

    // ✅ Send email if customer exists
    if (populatedShipping.customer && populatedShipping.customer.email) {
      await sendEmail({
        to: populatedShipping.customer.email,
        subject: template.subject,
        html: `
              <h2>Hello ${populatedShipping.customer.firstName} ${populatedShipping.customer.lastName},</h2>
              <p>Here’s the latest update on your order:</p>
              <p><b>Order ID:</b> ${populatedShipping._id}</p>
              <p><b>Car:</b> ${populatedShipping.car.make} ${populatedShipping.car.model}</p>
              ${template.body}
              <br/>
              <p>— The Car Shop Team</p>
            `,
      });
    }

    if (!shipping) {
      return res.status(404).json({
        success: false,
        message: "Shipping record not found",
      });
    }

    res.json({
      success: true,
      message: "Shipping record updated successfully",
      data: shipping,
    });
  } catch (error) {
    console.log(
      "Error occurred while updating shipping record:",
      error.message
    );

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
        message: "Invalid shipping ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllShippings,
  getShippingUser,
  createShipping,
  updateShipping,
};
