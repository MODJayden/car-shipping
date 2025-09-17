const Application = require("../model/application");
const Notification = require("../model/notification");
const sendEmail = require("../utils/sendEmail");

// Create new application
const createApplication = async (req, res) => {
  try {
    const { user, order, paymentPlan, employmentInfo, userId } = req.body;

    const newApplication = new Application({
      user,
      userId,
      order,
      paymentPlan,
      employmentInfo,
      amountPaid: 0,
      status: "pending",
    });

    await newApplication.save();

    res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: newApplication,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate("order.car");
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get applications for a specific user
const getApplicationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const applications = await Application.find({
      userId,
    }).populate("order.car");

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update amountPaid
const updateAmountPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { amountPaid } = req.body;

    const application = await Application.findByIdAndUpdate(
      id,
      { $inc: { amountPaid } }, // increment
      { new: true }
    );

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update status
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }
    if (status === "approved") {
      await Notification.create({
        recipient: user,
        order: application.order._id,
        type: "application-status-update",
        title: "Application approved",
        message: `Your Application has been approved successfully. You can now start the payment process for every month`,
        email: { sent: true, sentAt: new Date() },
      });

      await sendEmail({
        to: application.user.email,
        subject: "🚗 Application Confirmation",
        html: `
            <h2>Hello ${application.user.firstName} ${application.user.lastName},</h2>
            <p>Thank you for your application. 🎉</p>
            <p><b>Application ID:</b> ${application._id}</p>
            <p><b>Car:</b> ${application.order.car.make} ${application.order.car.model}</p>
            <p><b>Total Amount to be paid:</b> $${application.order.totalAmount}</p>
            <p>Monthly payments :${application.paymentPlan.monthlyPayment}</p>
            <br/>
            <p>— The Shuqran LLC</p>
          `,
      });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete application
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByIdAndDelete(id);

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationsByUser,
  updateAmountPaid,
  updateStatus,
  deleteApplication,
};
