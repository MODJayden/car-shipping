import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = `${import.meta.env.VITE_API_URL}/api/interestRate`;
// Interest Rate API endpoints
export const getAllInterestRates = createAsyncThunk(
  "interestRate/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${URL}/getAll`);
      return res?.data;
    } catch (error) {
      rejectWithValue(error.response.data.message);
    }
  }
);

export const getActiveInterestRates = createAsyncThunk(
  "interestRate/getActive",
  async (_, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/interestRate/active`,
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

export const getInterestRateById = createAsyncThunk(
  "interestRate/getById",
  async (id, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/interestRate/get/${id}`,
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

export const getInterestRateByDuration = createAsyncThunk(
  "interestRate/getByDuration",
  async (duration, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/interestRate/duration/${duration}`,
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

export const calculateLoanInterest = createAsyncThunk(
  "interestRate/calculate",
  async (calculationData, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/interestRate/calculate`,
      calculationData,
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

export const createInterestRate = createAsyncThunk(
  "interestRate/create",
  async (formData, { requestId }) => {
    try {
      const res = await axios.post(`${URL}/create`, formData);
      return res.data;
    } catch (error) {
      return requestId;
    }
  }
);

export const updateInterestRate = createAsyncThunk(
  "interestRate/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${URL}/update/${id}`, formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data.message);
    }
  }
);

export const deleteInterestRate = createAsyncThunk(
  "interestRate/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${URL}/delete/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data.message);
    }
  }
);

const initialState = {
  isLoading: false,
  interestRates: [],
  activeInterestRates: [],
  currentInterestRate: null,
  calculationResult: null,
  error: null,
  success: false,
};

const interestRateSlice = createSlice({
  name: "interestRate",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentInterestRate: (state) => {
      state.currentInterestRate = null;
    },
    clearCalculationResult: (state) => {
      state.calculationResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Interest Rates
      .addCase(getAllInterestRates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllInterestRates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.interestRates = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getAllInterestRates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Active Interest Rates
      .addCase(getActiveInterestRates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getActiveInterestRates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeInterestRates = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getActiveInterestRates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Interest Rate By ID
      .addCase(getInterestRateById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getInterestRateById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentInterestRate = action.payload?.data || null;
        state.error = null;
      })
      .addCase(getInterestRateById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Interest Rate By Duration
      .addCase(getInterestRateByDuration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getInterestRateByDuration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentInterestRate = action.payload?.data || null;
        state.error = null;
      })
      .addCase(getInterestRateByDuration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Calculate Loan Interest
      .addCase(calculateLoanInterest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(calculateLoanInterest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.calculationResult = action.payload?.data || null;
        state.error = null;
      })
      .addCase(calculateLoanInterest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Create Interest Rate
      .addCase(createInterestRate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createInterestRate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.interestRates.push(action.payload?.data);
        state.success = true;
        state.error = null;
      })
      .addCase(createInterestRate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Update Interest Rate
      .addCase(updateInterestRate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateInterestRate.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.interestRates.findIndex(
          (rate) => rate._id === action.payload?.data?._id
        );
        if (index !== -1) {
          state.interestRates[index] = action.payload.data;
        }
        if (
          state.currentInterestRate &&
          state.currentInterestRate._id === action.payload?.data?._id
        ) {
          state.currentInterestRate = action.payload.data;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(updateInterestRate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Delete Interest Rate
      .addCase(deleteInterestRate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteInterestRate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.interestRates = state.interestRates.filter(
          (rate) => rate._id !== action.payload?.data?._id
        );
        if (
          state.currentInterestRate &&
          state.currentInterestRate._id === action.payload?.data?._id
        ) {
          state.currentInterestRate = null;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(deleteInterestRate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  clearCurrentInterestRate,
  clearCalculationResult,
} = interestRateSlice.actions;
export default interestRateSlice.reducer;
