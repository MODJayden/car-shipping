const Order = require("../model/order");
const User = require("../model/user");
const PaymentPlan = require("../model/paymentPlan");
const Notification = require("../model/notification");
const axios = require("axios");
const Payment = require("../model/payment");

// Initialize Payment
const initializePayment = async (req, res) => {
  try {
    const { email, amount, id, currency } = req.body;

    const InterAmount = parseInt(amount);

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: InterAmount * 100, // Convert GHS to pesewas
        currency: currency,
        callback_url: `${process.env.CLIENT_URL}/#/callback`,
        metadata: {
          userId: id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      data: response?.data,
    });
  } catch (error) {
    console.error(
      "Paystack Init Error:",
      error.response?.data || error.message
    );
    return res
      .status(500)
      .json({ error: "Payment initialization failed" + error.message });
  }
};

// Verify Payment
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response?.data?.data;

    if (data?.status === "success") {
      // Your custom id comes back here
      const userId = data.metadata?.userId;

      // Save Payment record
      const payment = await Payment.create({
        userId: userId,
        amount: data.amount / 100,
        gateway: "paystack",
        currency: data.currency,
        gatewayPaymentId: data.reference,
        status: "success",
      });

      return res.status(200).json({
        message: "Payment verified and saved successfully",
        payment,
      });
    } else {
      return res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    console.error(
      "Paystack Verify Error:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: "Payment verification failed" });
  }
};

module.exports = { initializePayment, verifyPayment };
