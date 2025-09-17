import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Payment Plan API endpoints
export const getAllPaymentPlans = createAsyncThunk(
  "paymentPlan/getAll",
  async (_, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/paymentPlan/getAll`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  }
);

export const getPaymentPlanById = createAsyncThunk(
  "paymentPlan/getById",
  async (id, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/paymentPlan/get/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  }
);

export const getPaymentPlansByCustomer = createAsyncThunk(
  "paymentPlan/getByCustomer",
  async (customerId, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/paymentPlan/customer/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  }
);

export const getPaymentPlansByOrder = createAsyncThunk(
  "paymentPlan/getByOrder",
  async (orderId, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/paymentPlan/order/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  }
);

export const getPaymentPlansByStatus = createAsyncThunk(
  "paymentPlan/getByStatus",
  async (status, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/paymentPlan/status/${status}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  }
);

export const getUpcomingPayments = createAsyncThunk(
  "paymentPlan/getUpcoming",
  async (_, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/paymentPlan/upcoming/payments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  }
);

export const createPaymentPlan = createAsyncThunk(
  "paymentPlan/create",
  async (formData, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/paymentPlan/create/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  }
);

export const updatePaymentPlanStatus = createAsyncThunk(
  "paymentPlan/updateStatus",
  async ({ id, status }, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.patch(
      `${
        import.meta.env.VITE_API_URL
      }/api/paymentPlan/update/plan/status/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  }
);

export const updatePaymentPlan = createAsyncThunk(
  "paymentPlan/update",
  async ({ id, formData }, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/paymentPlan/payment-plan/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  }
);

export const deletePaymentPlan = createAsyncThunk(
  "paymentPlan/delete",
  async (id, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/paymentPlan/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  }
);

export const triggerAutomaticPayments = createAsyncThunk(
  "paymentPlan/triggerPayments",
  async (_, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/paymentPlan/process-payments`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  }
);

const initialState = {
  isLoading: false,
  paymentPlans: [],
  currentPaymentPlan: null,
  customerPaymentPlans: [],
  orderPaymentPlans: [],
  statusPaymentPlans: [],
  upcomingPayments: [],
  error: null,
  success: false,
};

const paymentPlanSlice = createSlice({
  name: "paymentPlan",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentPaymentPlan: (state) => {
      state.currentPaymentPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Payment Plans
      .addCase(getAllPaymentPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllPaymentPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentPlans = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getAllPaymentPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Payment Plan By ID
      .addCase(getPaymentPlanById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPaymentPlanById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPaymentPlan = action.payload?.data || null;
        state.error = null;
      })
      .addCase(getPaymentPlanById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Payment Plans By Customer
      .addCase(getPaymentPlansByCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPaymentPlansByCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerPaymentPlans = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getPaymentPlansByCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Payment Plans By Order
      .addCase(getPaymentPlansByOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPaymentPlansByOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderPaymentPlans = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getPaymentPlansByOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Payment Plans By Status
      .addCase(getPaymentPlansByStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPaymentPlansByStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statusPaymentPlans = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getPaymentPlansByStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Upcoming Payments
      .addCase(getUpcomingPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUpcomingPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.upcomingPayments = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getUpcomingPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Create Payment Plan
      .addCase(createPaymentPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPaymentPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentPlans.push(action.payload?.data);
        state.success = true;
        state.error = null;
      })
      .addCase(createPaymentPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Update Payment Plan Status
      .addCase(updatePaymentPlanStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePaymentPlanStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.paymentPlans.findIndex(
          (plan) => plan._id === action.payload?.data?._id
        );
        if (index !== -1) {
          state.paymentPlans[index] = action.payload.data;
        }
        if (
          state.currentPaymentPlan &&
          state.currentPaymentPlan._id === action.payload?.data?._id
        ) {
          state.currentPaymentPlan = action.payload.data;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(updatePaymentPlanStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Update Payment Plan
      .addCase(updatePaymentPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePaymentPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.paymentPlans.findIndex(
          (plan) => plan._id === action.payload?.data?._id
        );
        if (index !== -1) {
          state.paymentPlans[index] = action.payload.data;
        }
        if (
          state.currentPaymentPlan &&
          state.currentPaymentPlan._id === action.payload?.data?._id
        ) {
          state.currentPaymentPlan = action.payload.data;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(updatePaymentPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Delete Payment Plan
      .addCase(deletePaymentPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deletePaymentPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentPlans = state.paymentPlans.filter(
          (plan) => plan._id !== action.payload?.data?._id
        );
        if (
          state.currentPaymentPlan &&
          state.currentPaymentPlan._id === action.payload?.data?._id
        ) {
          state.currentPaymentPlan = null;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(deletePaymentPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Trigger Automatic Payments
      .addCase(triggerAutomaticPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(triggerAutomaticPayments.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(triggerAutomaticPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentPaymentPlan } =
  paymentPlanSlice.actions;
export default paymentPlanSlice.reducer;
