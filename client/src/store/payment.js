import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Payment API endpoints
const PAYMENT_URL = `${import.meta.env.VITE_API_URL}/api/payment`;

// Initialize Paystack payment
export const initializePayment = createAsyncThunk(
  "payment/initializePayment",
  async (paymentData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${PAYMENT_URL}/paystack/initialize`,
        paymentData
      );
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// Verify Paystack payment
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (reference, thunkAPI) => {
    try {
      const response = await axios.get(
        `${PAYMENT_URL}/paystack/verify/${reference}`
      );
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

const initialState = {
  // Payment initialization state
  paymentInitialization: {
    data: null,
    isLoading: false,
    error: null,
  },

  // Payment verification state
  paymentVerification: {
    data: null,
    isLoading: false,
    error: null,
    isVerified: false,
  },

  // Payment processing state
  paymentProcessing: {
    data: null,
    isLoading: false,
    error: null,
    isProcessing: false,
  },

  // Payment methods state
  paymentMethods: {
    data: [],
    isLoading: false,
    error: null,
  },

  // Payment history state
  paymentHistory: {
    data: [],
    isLoading: false,
    error: null,
  },

  // Current payment method
  selectedPaymentMethod: null,

  // Transaction reference (for tracking)
  transactionReference: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
  },
  extraReducers: (builder) => {
    builder // Initialize Payment
      .addCase(initializePayment.pending, (state) => {
        state.paymentInitialization.isLoading = true;
        state.paymentInitialization.error = null;
      })
      .addCase(initializePayment.fulfilled, (state, { payload }) => {
        state.paymentInitialization.isLoading = false;
        state.paymentInitialization.data = payload?.data;
        state.transactionReference = payload?.data?.reference;
      })
      .addCase(initializePayment.rejected, (state, { payload }) => {
        state.paymentInitialization.isLoading = false;
        state.paymentInitialization.error =
          payload?.message || "Failed to initialize payment";
      })

      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.paymentVerification.isLoading = true;
        state.paymentVerification.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, { payload }) => {
        state.paymentVerification.isLoading = false;
        state.paymentVerification.data = payload?.data;
        state.paymentVerification.isVerified =
          payload?.data?.status === "success";
      })
      .addCase(verifyPayment.rejected, (state, { payload }) => {
        state.paymentVerification.isLoading = false;
        state.paymentVerification.error =
          payload?.message || "Failed to verify payment";
        state.paymentVerification.isVerified = false;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentPayment } =
  paymentSlice.actions;
export default paymentSlice.reducer;
