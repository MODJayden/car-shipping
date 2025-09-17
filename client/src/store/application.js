import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = `${import.meta.env.VITE_API_URL}/api/application`;

// ✅ Create application
export const createApplication = createAsyncThunk(
  "application/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${URL}/create`, payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error creating application"
      );
    }
  }
);

// ✅ Update amountPaid
export const updateAmountPaid = createAsyncThunk(
  "application/updateAmountPaid",
  async ({ id, amountPaid }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${URL}/update-amount/${id}`, {
        amountPaid,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating amount paid"
      );
    }
  }
);

// ✅ Update status
export const updateStatus = createAsyncThunk(
  "application/updateStatus",
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${URL}/update-status/${applicationId}`, { status });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating status"
      );
    }
  }
);

// ✅ Delete application
export const deleteApplication = createAsyncThunk(
  "application/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${URL}/delete/${id}`);
      return { id, ...res.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting application"
      );
    }
  }
);

// ✅ Get all applications
export const getAllApplications = createAsyncThunk(
  "application/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${URL}/all`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching applications"
      );
    }
  }
);

// ✅ Get applications for a user
export const getApplicationsByUser = createAsyncThunk(
  "application/getByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${URL}/user/${userId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching user applications"
      );
    }
  }
);

// 📦 Slice
const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applications: [],
    userApplications: [],
    application: null,
    isLoading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createApplication.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications.unshift(action.payload.data);
        state.success = action.payload.message;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update amountPaid
      .addCase(updateAmountPaid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
        const idx = state.applications.findIndex(
          (app) => app._id === action.payload.data._id
        );
        if (idx > -1) state.applications[idx] = action.payload.data;
      })

      // Update status
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
        const idx = state.applications.findIndex(
          (app) => app._id === action.payload.data._id
        );
        if (idx > -1) state.applications[idx] = action.payload.data;
      })

      // Delete
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
        state.applications = state.applications.filter(
          (app) => app._id !== action.payload.id
        );
      })

      // Get all
      .addCase(getAllApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload.data;
      })

      // Get user apps
      .addCase(getApplicationsByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userApplications = action.payload.data;
      });
  },
});

export const { clearMessages } = applicationSlice.actions;
export default applicationSlice.reducer;
