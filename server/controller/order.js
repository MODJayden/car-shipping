const Order = require("../model/order");
const User = require("../model/user");
const Car = require("../model/car");
const Shipping = require("../model/shipping");
const Notification = require("../model/notification");
const sendEmail = require("../utils/sendEmail");
// Get all orders
const getAllOrders = async (req, res) => {
  try {
    // Execute query with pagination
    const orders = await Order.find()
      .populate(
        "car",
        "make model year color condition fuelType transmission originCountry price images"
      )
      .sort({ createdAt: -1 });

    // Get total count for pagination info
    const total = await Order.countDocuments();

    res.json({
      success: true,
      count: orders.length,
      total,
      data: orders,
    });
  } catch (error) {
    console.log("Error occurred while fetching orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "firstName lastName email phone")
      .populate(
        "car",
        "make model year color condition fuelType transmission originCountry price images"
      )
      .populate("shipping");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log("Error occurred while fetching order:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get order by order number
const getOrderForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    const order = await Order.find({ userId }).populate(
      "car",
      "make model year color condition fuelType transmission originCountry price images"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log(
      "Error occurred while fetching order by order number:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get orders by customer
const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;

    // Validate customer exists
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Build filter object
    const filter = { customer: customerId };

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate("car", "make model year color images")
      .populate("shipping")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: orders,
    });
  } catch (error) {
    console.log(
      "Error occurred while fetching orders by customer:",
      error.message
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      customer,
      car,
      userId,
      carPrice,
      totalPricePaid,
      paymentMethod,
      paymentStatus,
      status,
      deliveryAddress,
      notifications,
      paymentId,
    } = req.body;

    // Validate required fields
    if (
      !customer ||
      !car ||
      !userId ||
      !paymentId ||
      !totalPricePaid ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Customer, car, carPrice, userId, paymentId, totalAmount, and paymentMethod are required",
      });
    }

    // Validate car exists
    const carDoc = await Car.findById(car);
    if (!carDoc) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Validate payment method
    const validPaymentMethods = ["full-payment", "installment"];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: `Payment method must be one of: ${validPaymentMethods.join(
          ", "
        )}`,
      });
    }

    // Validate amounts
    if (carPrice <= 0 || totalPricePaid <= 0) {
      return res.status(400).json({
        success: false,
        message: "Prices and amounts must be greater than 0",
      });
    }

    // Create the order
    const order = await Order.create({
      customer,
      car,
      userId,
      carPrice,
      totalPricePaid,
      paymentMethod,
      paymentStatus: "completed",
      status,
      deliveryAddress,
      notifications,
      paymentId,
    });
    const user = userId.toString();

    // Create notification for order confirmation
    await Notification.create({
      recipient: user,
      order: order._id,
      type: "order-confirmation",
      title: "Order Confirmed",
      message: `Your Payment for order #${order._id} has been confirmed successfully.`,
      email: { sent: true, sentAt: new Date() },
    });

    await sendEmail({
      to: customer.email,
      subject: "🚗 Order Confirmation",
      html: `
        <h2>Hello ${customer.firstName} ${customer.lastName},</h2>
        <p>Thank you for your order. 🎉</p>
        <p><b>Order ID:</b> ${order._id}</p>
        <p><b>Car:</b> ${carDoc.make} ${carDoc.model}</p>
        <p><b>Total Paid:</b> $${totalPricePaid}</p>
        <p>We’ll update you when your order is ready for delivery.</p>
        <br/>
        <p>— The Car Shop Team</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.log("Error occurred while creating order:", error.message);
  }
};

// Update order status

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // Allowed statuses
    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    // Find and update the order
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate("car customer"); // get car + customer details

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ✅ Create in-app notification
    await Notification.create({
      recipient: order.userId,
      order: order._id,
      type: "shipping-update",
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your order #${order._id} status has been updated to: ${status}.`,
      email: { sent: true, sentAt: new Date() },
    });

    // ✅ Email subject & body mapping
    const emailTemplates = {
      pending: {
        subject: `⏳ Order #${order._id} is Pending`,
        body: `<p>Your order has been placed and is awaiting confirmation.</p>`,
      },
      confirmed: {
        subject: `✅ Order #${order._id} Confirmed`,
        body: `<p>Your order has been confirmed. We’ll start processing it shortly.</p>`,
      },
      processing: {
        subject: `⚙️ Order #${order._id} is Being Processed`,
        body: `<p>We are preparing your car for shipment. You’ll be notified once it’s shipped.</p>`,
      },
      shipped: {
        subject: `🚚 Order #${order._id} Shipped`,
        body: `<p>Your order is on the way! You’ll receive delivery details soon.</p>`,
      },
      delivered: {
        subject: `🎉 Order #${order._id} Delivered`,
        body: `<p>Your car has been delivered. Enjoy your new ride 🚗!</p>`,
      },
      cancelled: {
        subject: `⚠️ Order #${order._id} Cancelled`,
        body: `<p>Your order has been cancelled. If you believe this is a mistake, please contact support.</p>`,
      },
    };

    const template = emailTemplates[status];

    // ✅ Send email if customer exists
    if (order.customer && order.customer.email) {
      await sendEmail({
        to: order.customer.email,
        subject: template.subject,
        html: `
          <h2>Hello ${order.customer.firstName} ${order.customer.lastName},</h2>
          <p>Here’s the latest update on your order:</p>
          <p><b>Order ID:</b> ${order._id}</p>
          <p><b>Car:</b> ${order.car.make} ${order.car.model}</p>
          ${template.body}
          <br/>
          <p>— The Car Shop Team</p>
        `,
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.log("Error occurred while updating order status:", error.message);

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
        message: "Invalid order ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update order shipping
const updateOrderShipping = async (req, res) => {
  try {
    const { shipping } = req.body;

    // Validate shipping
    if (!shipping) {
      return res.status(400).json({
        success: false,
        message: "Shipping ID is required",
      });
    }

    // Validate shipping exists
    const shippingDoc = await Shipping.findById(shipping);
    if (!shippingDoc) {
      return res.status(404).json({
        success: false,
        message: "Shipping not found",
      });
    }

    // Find and update the order shipping
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { shipping },
      { new: true, runValidators: true }
    )
      .populate("customer", "firstName lastName email phone")
      .populate("car", "make model year color")
      .populate("shipping");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order shipping updated successfully",
      data: order,
    });
  } catch (error) {
    console.log("Error occurred while updating order shipping:", error.message);

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
        message: "Invalid order ID or shipping ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update order (full update - admin only)
const updateOrder = async (req, res) => {
  try {
    const {
      carPrice,
      shippingCost,
      totalAmount,
      downPayment,
      paymentMethod,
      paymentStatus,
      status,
      deliveryAddress,
      notifications,
      shipping,
    } = req.body;

    // Validate at least one field to update
    if (
      !carPrice &&
      !shippingCost &&
      !totalAmount &&
      !downPayment &&
      !paymentMethod &&
      !paymentStatus &&
      !status &&
      !deliveryAddress &&
      !notifications &&
      !shipping
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided for update",
      });
    }

    // Build update object
    const updateData = {};

    if (carPrice !== undefined) {
      if (carPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: "Car price must be greater than 0",
        });
      }
      updateData.carPrice = carPrice;
    }

    if (shippingCost !== undefined) {
      if (shippingCost < 0) {
        return res.status(400).json({
          success: false,
          message: "Shipping cost cannot be negative",
        });
      }
      updateData.shippingCost = shippingCost;
    }

    if (totalAmount !== undefined) {
      if (totalAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Total amount must be greater than 0",
        });
      }
      updateData.totalAmount = totalAmount;
    }

    if (downPayment !== undefined) {
      if (downPayment < 0) {
        return res.status(400).json({
          success: false,
          message: "Down payment cannot be negative",
        });
      }
      updateData.downPayment = downPayment;
    }

    if (paymentMethod) {
      const validPaymentMethods = ["full-payment", "installment"];
      if (!validPaymentMethods.includes(paymentMethod)) {
        return res.status(400).json({
          success: false,
          message: `Payment method must be one of: ${validPaymentMethods.join(
            ", "
          )}`,
        });
      }
      updateData.paymentMethod = paymentMethod;
    }

    if (paymentStatus) {
      const allowedPaymentStatuses = [
        "pending",
        "partially-paid",
        "paid",
        "overdue",
      ];
      if (!allowedPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: `Payment status must be one of: ${allowedPaymentStatuses.join(
            ", "
          )}`,
        });
      }
      updateData.paymentStatus = paymentStatus;
    }

    if (status) {
      const allowedStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status must be one of: ${allowedStatuses.join(", ")}`,
        });
      }
      updateData.status = status;
    }

    if (deliveryAddress) updateData.deliveryAddress = deliveryAddress;
    if (notifications) updateData.notifications = notifications;

    if (shipping) {
      const shippingDoc = await Shipping.findById(shipping);
      if (!shippingDoc) {
        return res.status(404).json({
          success: false,
          message: "Shipping not found",
        });
      }
      updateData.shipping = shipping;
    }

    // Find and update the order
    const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("customer", "firstName lastName email phone")
      .populate("car", "make model year color")
      .populate("shipping");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    console.log("Error occurred while updating order:", error.message);

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
        message: "Invalid order ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.log("Error occurred while deleting order:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get orders by status
const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate status
    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    const orders = await Order.find({ status })
      .populate("customer", "firstName lastName email phone")
      .populate("car", "make model year color")
      .populate("shipping")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments({ status });

    res.json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: orders,
    });
  } catch (error) {
    console.log(
      "Error occurred while fetching orders by status:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get orders by payment status
const getOrdersByPaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate payment status
    const allowedPaymentStatuses = [
      "pending",
      "partially-paid",
      "paid",
      "overdue",
    ];

    if (!allowedPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Payment status must be one of: ${allowedPaymentStatuses.join(
          ", "
        )}`,
      });
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    const orders = await Order.find({ paymentStatus })
      .populate("customer", "firstName lastName email phone")
      .populate("car", "make model year color")
      .populate("shipping")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments({ paymentStatus });

    res.json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: orders,
    });
  } catch (error) {
    console.log(
      "Error occurred while fetching orders by payment status:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrderForUser,
  getOrdersByCustomer,
  createOrder,
  updateOrderStatus,
  updateOrderShipping,
  updateOrder,
  deleteOrder,
  getOrdersByStatus,
  getOrdersByPaymentStatus,
};
