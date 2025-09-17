const PaymentPlan = require("../model/paymentPlan");
const Order = require("../model/order");
const User = require("../model/user");
const InterestRate = require("../model/interestRate");
const Payment = require("../model/payment");
const Notification = require("../model/notification");

// Helper function to calculate monthly payment
const calculateMonthlyPayment = (principal, annualRate, years) => {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  return (
    (principal * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -numberOfPayments))
  );
};

// Helper function to calculate total amount with interest
const calculateTotalAmount = (principal, annualRate, years) => {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
  return monthlyPayment * (years * 12);
};

// Get all payment plans
const getAllPaymentPlans = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const {
      order,
      customer,
      planDuration,
      status,
      autoDeduction,
      paymentMethod,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order: sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (order) filter.order = order;
    if (customer) filter.customer = customer;
    if (planDuration) filter.planDuration = Number(planDuration);
    if (status) filter.status = status;
    if (autoDeduction !== undefined)
      filter.autoDeduction = autoDeduction === "true";
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    // Amount range filter
    if (minAmount || maxAmount) {
      filter.totalAmount = {};
      if (minAmount) filter.totalAmount.$gte = Number(minAmount);
      if (maxAmount) filter.totalAmount.$lte = Number(maxAmount);
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Determine sort order
    const orderValue = sortOrder === "desc" ? -1 : 1;
    const sortOptions = { [sortBy]: orderValue };

    // Execute query with pagination
    const paymentPlans = await PaymentPlan.find(filter)
      .populate("order", "orderNumber totalAmount carPrice shippingCost")
      .populate("customer", "firstName lastName email phone")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination info
    const total = await PaymentPlan.countDocuments(filter);

    res.json({
      success: true,
      count: paymentPlans.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: paymentPlans,
    });
  } catch (error) {
    console.log("Error occurred while fetching payment plans:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get payment plan by ID
const getPaymentPlanById = async (req, res) => {
  try {
    const paymentPlan = await PaymentPlan.findById(req.params.id)
      .populate(
        "order",
        "orderNumber totalAmount carPrice shippingCost paymentStatus"
      )
      .populate("customer", "firstName lastName email phone");

    if (!paymentPlan) {
      return res.status(404).json({
        success: false,
        message: "Payment plan not found",
      });
    }

    res.json({
      success: true,
      data: paymentPlan,
    });
  } catch (error) {
    console.log("Error occurred while fetching payment plan:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid payment plan ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get payment plans by customer
const getPaymentPlansByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

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

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    const paymentPlans = await PaymentPlan.find(filter)
      .populate("order", "orderNumber totalAmount")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await PaymentPlan.countDocuments(filter);

    res.json({
      success: true,
      count: paymentPlans.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: paymentPlans,
    });
  } catch (error) {
    console.log(
      "Error occurred while fetching payment plans by customer:",
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

// Get payment plans by order
const getPaymentPlansByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Validate order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const paymentPlans = await PaymentPlan.find({ order: orderId }).populate(
      "customer",
      "firstName lastName email phone"
    );

    res.json({
      success: true,
      count: paymentPlans.length,
      data: paymentPlans,
    });
  } catch (error) {
    console.log(
      "Error occurred while fetching payment plans by order:",
      error.message
    );

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

// Create a new payment plan
const createPaymentPlan = async (req, res) => {
  try {
    const {
      order,
      customer,
      planDuration,
      paymentMethod,
      paymentDay,
      autoDeduction,
    } = req.body;

    // Validate required fields
    if (!order || !customer || !planDuration || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message:
          "Order, customer, planDuration, and paymentMethod are required",
      });
    }

    // Validate customer exists
    const customerUser = await User.findById(customer);
    if (!customerUser) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Validate order exists
    const orderDoc = await Order.findById(order);
    if (!orderDoc) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if payment plan already exists for this order
    const existingPlan = await PaymentPlan.findOne({ order });
    if (existingPlan) {
      return res.status(409).json({
        success: false,
        message: "Payment plan already exists for this order",
      });
    }

    // Validate plan duration
    const validDurations = [1, 2, 3];
    if (!validDurations.includes(Number(planDuration))) {
      return res.status(400).json({
        success: false,
        message: "Plan duration must be 1, 2, or 3 years",
      });
    }

    // Validate payment method
    const validPaymentMethods = [
      "bank-transfer",
      "credit-card",
      "mobile-money",
    ];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: `Payment method must be one of: ${validPaymentMethods.join(
          ", "
        )}`,
      });
    }

    // Validate payment day if provided
    if (paymentDay && (paymentDay < 1 || paymentDay > 31)) {
      return res.status(400).json({
        success: false,
        message: "Payment day must be between 1 and 31",
      });
    }

    // Get interest rate for the duration
    const interestRateDoc = await InterestRate.findOne({
      duration: Number(planDuration),
      isActive: true,
    });

    if (!interestRateDoc) {
      return res.status(404).json({
        success: false,
        message: `No active interest rate found for ${planDuration} year duration`,
      });
    }

    // Calculate payment details
    const principal = orderDoc.totalAmount;
    const interestRate = interestRateDoc.rate;
    const monthlyPayment = calculateMonthlyPayment(
      principal,
      interestRate,
      planDuration
    );
    const totalPayments = planDuration * 12;
    const totalAmount = calculateTotalAmount(
      principal,
      interestRate,
      planDuration
    );

    // Set next payment date (default to current date + 1 month)
    const nextPaymentDate = new Date();
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    // If payment day is specified, set the day of the month
    if (paymentDay) {
      nextPaymentDate.setDate(paymentDay);
      // If the day has already passed this month, set for next month
      const today = new Date();
      if (nextPaymentDate < today) {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      }
    }

    // Create the payment plan
    const paymentPlan = await PaymentPlan.create({
      order,
      customer,
      planDuration: Number(planDuration),
      interestRate,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100, // Round to 2 decimal places
      totalPayments,
      totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
      autoDeduction: autoDeduction || false,
      paymentMethod,
      nextPaymentDate,
      paymentDay: paymentDay || null,
    });

    // Populate the created payment plan
    const populatedPaymentPlan = await PaymentPlan.findById(paymentPlan._id)
      .populate("order", "orderNumber totalAmount")
      .populate("customer", "firstName lastName email phone");

    // Update order payment method to installment
    await Order.findByIdAndUpdate(order, {
      paymentMethod: "installment",
    });

    // Create notification for payment plan creation
    await Notification.create({
      recipient: customer,
      order: order,
      type: "payment-due",
      title: "Payment Plan Created",
      message: `Your ${planDuration}-year payment plan has been created. Monthly payment: $${monthlyPayment.toFixed(
        2
      )}. First payment due: ${nextPaymentDate.toDateString()}.`,
      email: { sent: true, sentAt: new Date() },
    });

    res.status(201).json({
      success: true,
      message: "Payment plan created successfully",
      data: populatedPaymentPlan,
    });
  } catch (error) {
    console.log("Error occurred while creating payment plan:", error.message);

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

// Update payment plan status
const updatePaymentPlanStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // Validate that status is one of the allowed values
    const allowedStatuses = ["active", "completed", "defaulted", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    // Find and update the payment plan status
    const paymentPlan = await PaymentPlan.findByIdAndUpdate(
      req.params.id,
      {
        status,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    )
      .populate("order", "orderNumber totalAmount")
      .populate("customer", "firstName lastName email phone");

    if (!paymentPlan) {
      return res.status(404).json({
        success: false,
        message: "Payment plan not found",
      });
    }

    res.json({
      success: true,
      message: "Payment plan status updated successfully",
      data: paymentPlan,
    });
  } catch (error) {
    console.log(
      "Error occurred while updating payment plan status:",
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
        message: "Invalid payment plan ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update payment plan (full update - admin only)
const updatePaymentPlan = async (req, res) => {
  try {
    const {
      autoDeduction,
      paymentMethod,
      paymentDay,
      status,
      nextPaymentDate,
    } = req.body;

    // Validate at least one field to update
    if (
      autoDeduction === undefined &&
      !paymentMethod &&
      !paymentDay &&
      !status &&
      !nextPaymentDate
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided for update",
      });
    }

    // Build update object
    const updateData = { updatedAt: new Date() };

    if (autoDeduction !== undefined) updateData.autoDeduction = autoDeduction;

    if (paymentMethod) {
      const validPaymentMethods = [
        "bank-transfer",
        "credit-card",
        "mobile-money",
      ];
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

    if (paymentDay !== undefined) {
      if (paymentDay !== null && (paymentDay < 1 || paymentDay > 31)) {
        return res.status(400).json({
          success: false,
          message: "Payment day must be between 1 and 31",
        });
      }
      updateData.paymentDay = paymentDay;
    }

    if (status) {
      const allowedStatuses = ["active", "completed", "defaulted", "cancelled"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status must be one of: ${allowedStatuses.join(", ")}`,
        });
      }
      updateData.status = status;
    }

    if (nextPaymentDate) {
      updateData.nextPaymentDate = new Date(nextPaymentDate);
    }

    // Find and update the payment plan
    const paymentPlan = await PaymentPlan.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("order", "orderNumber totalAmount")
      .populate("customer", "firstName lastName email phone");

    if (!paymentPlan) {
      return res.status(404).json({
        success: false,
        message: "Payment plan not found",
      });
    }

    res.json({
      success: true,
      message: "Payment plan updated successfully",
      data: paymentPlan,
    });
  } catch (error) {
    console.log("Error occurred while updating payment plan:", error.message);

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
        message: "Invalid payment plan ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete a payment plan
const deletePaymentPlan = async (req, res) => {
  try {
    const paymentPlan = await PaymentPlan.findByIdAndDelete(req.params.id);

    if (!paymentPlan) {
      return res.status(404).json({
        success: false,
        message: "Payment plan not found",
      });
    }

    res.json({
      success: true,
      message: "Payment plan deleted successfully",
    });
  } catch (error) {
    console.log("Error occurred while deleting payment plan:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid payment plan ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get payment plans by status
const getPaymentPlansByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate status
    const allowedStatuses = ["active", "completed", "defaulted", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    const paymentPlans = await PaymentPlan.find({ status })
      .populate("order", "orderNumber totalAmount")
      .populate("customer", "firstName lastName email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await PaymentPlan.countDocuments({ status });

    res.json({
      success: true,
      count: paymentPlans.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: paymentPlans,
    });
  } catch (error) {
    console.log(
      "Error occurred while fetching payment plans by status:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get upcoming payments
const getUpcomingPayments = async (req, res) => {
  try {
    const { days = 7, page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + Number(days));

    const paymentPlans = await PaymentPlan.find({
      status: "active",
      nextPaymentDate: {
        $gte: currentDate,
        $lte: futureDate,
      },
    })
      .populate("order", "orderNumber totalAmount")
      .populate("customer", "firstName lastName email phone")
      .sort({ nextPaymentDate: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await PaymentPlan.countDocuments({
      status: "active",
      nextPaymentDate: {
        $gte: currentDate,
        $lte: futureDate,
      },
    });

    res.json({
      success: true,
      count: paymentPlans.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      days: Number(days),
      data: paymentPlans,
    });
  } catch (error) {
    console.log(
      "Error occurred while fetching upcoming payments:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Process automatic payments (cron job function)
const processAutomaticPayments = async () => {
  try {
    const currentDate = new Date();

    // Find payment plans with auto-deduction enabled and due today
    const paymentPlans = await PaymentPlan.find({
      status: "active",
      autoDeduction: true,
      nextPaymentDate: { $lte: currentDate },
    })
      .populate("order", "orderNumber totalAmount")
      .populate("customer", "firstName lastName email phone");

    let processedCount = 0;
    let failedCount = 0;

    for (const plan of paymentPlans) {
      try {
        // Create a new payment record
        const payment = await Payment.create({
          order: plan.order._id,
          customer: plan.customer._id,
          amount: plan.monthlyPayment,
          paymentMethod: plan.paymentMethod,
          paymentType: "installment",
          status: "completed",
          paidDate: new Date(),
          isAutoDeducted: true,
        });

        // Update next payment date (add 1 month)
        const nextPaymentDate = new Date(plan.nextPaymentDate);
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

        // If payment day is specified, set the day of the month
        if (plan.paymentDay) {
          nextPaymentDate.setDate(plan.paymentDay);
        }

        await PaymentPlan.findByIdAndUpdate(plan._id, {
          nextPaymentDate,
          updatedAt: new Date(),
        });

        // Create notification for automatic payment
        await Notification.create({
          recipient: plan.customer._id,
          order: plan.order._id,
          type: "payment-received",
          title: "Automatic Payment Processed",
          message: `Automatic payment of $${plan.monthlyPayment.toFixed(
            2
          )} for order #${
            plan.order.orderNumber
          } has been processed successfully. Next payment due: ${nextPaymentDate.toDateString()}.`,
          email: { sent: true, sentAt: new Date() },
        });

        processedCount++;
      } catch (error) {
        console.log(
          `Error processing automatic payment for plan ${plan._id}:`,
          error.message
        );
        failedCount++;

        // Create notification for failed automatic payment
        await Notification.create({
          recipient: plan.customer._id,
          order: plan.order._id,
          type: "payment-due",
          title: "Automatic Payment Failed",
          message: `Automatic payment of $${plan.monthlyPayment.toFixed(
            2
          )} for order #${
            plan.order.orderNumber
          } failed. Please update your payment method.`,
          email: { sent: true, sentAt: new Date() },
        });
      }
    }

    console.log(
      `Processed ${processedCount} automatic payments, ${failedCount} failed`
    );
    return { processedCount, failedCount };
  } catch (error) {
    console.log("Error in processAutomaticPayments:", error.message);
    throw error;
  }
};

// Manual trigger for automatic payments (admin only)
const triggerAutomaticPayments = async (req, res) => {
  try {
    const result = await processAutomaticPayments();

    res.json({
      success: true,
      message: "Automatic payments processed",
      data: result,
    });
  } catch (error) {
    console.log(
      "Error occurred while triggering automatic payments:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
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
  processAutomaticPayments,
  triggerAutomaticPayments,
};
