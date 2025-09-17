import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Order API endpoints
export const getAllOrders = createAsyncThunk(
  "order/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/order/getAll`
      );
      return res.data;
    } catch (error) {
      rejectWithValue(error.response.data.message);
    }
  }
);

export const getOrderForUser = createAsyncThunk(
  "order/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/order/user/orders/${id}`
      );
      return res.data;
    } catch (error) {
      rejectWithValue(error.response.data.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  "order/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/order/create`,
        formData
      );
      return res.data;
    } catch (error) {
      rejectWithValue(error.response.data.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/order/patch/${id}/status`,
        { status }
      );
      return res.data;
    } catch (error) {
      rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  isLoading: false,
  orders: [],
  currentOrder: null,
  customerOrders: [],
  statusOrders: [],
  paymentStatusOrders: [],
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Orders
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Order By ID
      .addCase(getOrderForUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderForUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerOrders = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getOrderForUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.push(action.payload?.data);
        state.success = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload?.data?._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload.data;
        }
        if (
          state.currentOrder &&
          state.currentOrder._id === action.payload?.data?._id
        ) {
          state.currentOrder = action.payload.data;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentOrder } =
  orderSlice.actions;
export default orderSlice.reducer;
