import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Shipping API endpoints
export const getAllShippings = createAsyncThunk(
  "shipping/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shipping/getAll`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getShippingUser = createAsyncThunk(
  "shipping/getById",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shipping/${userId}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createShipping = createAsyncThunk(
  "shipping/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shipping/create`,
        formData
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateShippingStatus = createAsyncThunk(
  "shipping/updateStatus",
  async ({ id, status }, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/shipping/patch/${id}/status`,
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

export const updateShipping = createAsyncThunk(
  "shipping/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/shipping/update/${id}`,
        formData
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteShipping = createAsyncThunk(
  "shipping/delete",
  async (shippingId, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/shipping/delete/${shippingId}`,
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
  shippings: [], // All shipping records
  currentShipping: null, // Currently selected shipping
  filteredShippings: [],
  customerShippings: [],
  error: null,
  success: false,
  statusFilter: null, // Current status filter
};

const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentShipping: (state) => {
      state.currentShipping = null;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    clearStatusFilter: (state) => {
      state.statusFilter = null;
      state.filteredShippings = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Shippings
      .addCase(getAllShippings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllShippings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shippings = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getAllShippings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Shipping By Tracking Number
      .addCase(getShippingUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getShippingUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerShippings = action.payload?.data || null;
        state.error = null;
      })
      .addCase(getShippingUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Create Shipping
      .addCase(createShipping.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createShipping.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shippings.push(action.payload?.data);
        state.success = true;
        state.error = null;
      })
      .addCase(createShipping.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Update Shipping Status
      .addCase(updateShippingStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateShippingStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the shipping in the list if it exists
        const index = state.shippings.findIndex(
          (shipping) => shipping._id === action.payload?.data?._id
        );
        if (index !== -1) {
          state.shippings[index] = action.payload.data;
        }

        // Update current shipping if it's the one being updated
        if (
          state.customerShippings &&
          state.currentShipping._id === action.payload?.data?._id
        ) {
          state.currentShipping = action.payload.data;
        }

        state.success = true;
        state.error = null;
      })
      .addCase(updateShippingStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Update Shipping
      .addCase(updateShipping.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateShipping.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the shipping in the list if it exists
        const index = state.shippings.findIndex(
          (shipping) => shipping._id === action.payload?.data?._id
        );
        if (index !== -1) {
          state.shippings[index] = action.payload.data;
        }

        // Update current shipping if it's the one being updated
        if (
          state.currentShipping &&
          state.currentShipping._id === action.payload?.data?._id
        ) {
          state.currentShipping = action.payload.data;
        }

        state.success = true;
        state.error = null;
      })
      .addCase(updateShipping.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Delete Shipping
      .addCase(deleteShipping.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteShipping.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the shipping from the list
        state.shippings = state.shippings.filter(
          (shipping) => shipping._id !== action.payload?.data?._id
        );

        // Clear current shipping if it's the one being deleted
        if (
          state.currentShipping &&
          state.currentShipping._id === action.payload?.data?._id
        ) {
          state.currentShipping = null;
        }

        state.success = true;
        state.error = null;
      })
      .addCase(deleteShipping.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  clearCurrentShipping,
  setStatusFilter,
  clearStatusFilter,
} = shippingSlice.actions;

export default shippingSlice.reducer;
