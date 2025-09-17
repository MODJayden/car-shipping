import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = `${import.meta.env.VITE_API_URL}/api/car`;

// Car API endpoints
export const getAllCars = createAsyncThunk(
  "car/getAll",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${URL}/getAllCars`, {
        params: queryParams, // ✅ pass query params here
      });
      return res?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getCarById = createAsyncThunk(
  "car/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${URL}/get/${id}`);
      return res?.data;
    } catch (error) {
      rejectWithValue(error.response.data.message);
    }
  }
);

export const getCarsByMake = createAsyncThunk(
  "car/getByMake",
  async (make, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/car/make/${make}`,
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

export const getCarsByCondition = createAsyncThunk(
  "car/getByCondition",
  async (condition, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/car/condition/${condition}`,
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

export const createCar = createAsyncThunk(
  "car/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${URL}/create`, formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data.message);
    }
  }
);

export const updateCar = createAsyncThunk(
  "car/update",
  async ({ id, formData }, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/car/update/${id}`,
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

export const deleteCar = createAsyncThunk(
  "car/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${URL}/delete/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data.message);
    }
  }
);

// Upload product images
export const uploadProductImages = createAsyncThunk(
  "products/uploadImages",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(`${URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

const initialState = {
  isLoading: false,
  cars: [],
  currentCar: null,
  makeCars: [],
  conditionCars: [],
  error: null,
  success: false,
  uploadStatus: "idle",
};

const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentCar: (state) => {
      state.currentCar = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Cars
      .addCase(getAllCars.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllCars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cars = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getAllCars.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Car By ID
      .addCase(getCarById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCarById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCar = action.payload?.data || null;
        state.error = null;
      })
      .addCase(getCarById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Cars By Make
      .addCase(getCarsByMake.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCarsByMake.fulfilled, (state, action) => {
        state.isLoading = false;
        state.makeCars = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getCarsByMake.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Cars By Condition
      .addCase(getCarsByCondition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCarsByCondition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conditionCars = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getCarsByCondition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Create Car
      .addCase(createCar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cars.push(action.payload?.data);
        state.success = true;
        state.error = null;
      })
      .addCase(createCar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Update Car
      .addCase(updateCar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.cars.findIndex(
          (car) => car._id === action.payload?.data?._id
        );
        if (index !== -1) {
          state.cars[index] = action.payload.data;
        }
        if (
          state.currentCar &&
          state.currentCar._id === action.payload?.data?._id
        ) {
          state.currentCar = action.payload.data;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Delete Car
      .addCase(deleteCar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cars = state.cars.filter(
          (car) => car._id !== action.payload?.data?._id
        );
        if (
          state.currentCar &&
          state.currentCar._id === action.payload?.data?._id
        ) {
          state.currentCar = null;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(uploadProductImages.pending, (state) => {
        state.uploadStatus = "uploading";
        state.error = null;
      })
      .addCase(uploadProductImages.fulfilled, (state, { payload }) => {
        state.uploadStatus = "success";
        // You might want to update a product with the uploaded images here
      })
      .addCase(uploadProductImages.rejected, (state, { payload }) => {
        state.uploadStatus = "error";
        state.error = payload?.message || "Image upload failed";
      });
  },
});

export const { clearError, clearSuccess, clearCurrentCar } = carSlice.actions;
export default carSlice.reducer;
