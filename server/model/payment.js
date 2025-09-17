// models/Payment.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: { type: String },      
  gateway: { type: String, required: true }, 
  amount: { type: Number, required: true }, 
  currency: { type: String, default: 'USD' },
  status: { type: String, default: 'created' },
  gatewayPaymentId: { type: String }, 
 
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
