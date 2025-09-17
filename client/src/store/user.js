import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// User API endpoints
export const registerUser = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/register`,
        formData,
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      if (err.response && err.response.data) {
        // Return server error message as payload
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        formData,
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        // Return server error message as payload
        return rejectWithValue(error.response.data.message);
      } else {
        // Return error message as payload
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/getAll",
  async (_, { getState }) => {
    const token = getState().user.token;
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/user/getAll`,
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

export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userId, { getState }) => {
    const token = getState().user.token;
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/user/getUser/${userId}`,
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

export const updateUserInfo = createAsyncThunk(
  "user/update",
  async ({ id, formData }, { getState }) => {
    const token = getState().user.token;
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/user/update/${id}`,
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

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ id, formData }, { getState }) => {
    const token = getState().user.token;
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/user/change-password/${id}`,
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

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (userId, { getState }) => {
    const token = getState().user.token;
    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/user/delete/${userId}`,
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

export const checkAuth = createAsyncThunk(
  "/auth/check-auth",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/check-auth`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-control":
              "must-revalidate,proxy-revalidate,no-cache,no-store",
          },
        }
      );

      return res?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { getState }) => {
    const token = getState().user.token;
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/user/logout`,
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
  isAuth: false,
  isLoading: false,
  user: null,
  users: [], // For storing multiple users
  token: null,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetTokenAndCredential: (state) => {
      state.isAuth = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.success = false;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.user = action.payload?.data;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.data;
        state.isAuth = true;
        state.token = action.payload?.token;
        state.error = null;
        localStorage.setItem("token", JSON.stringify(action.payload?.data?.token));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuth = false;
        state.user = null;
        state.token = null;
        state.error = action.error.message;
      })

      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload?.data;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get User By ID
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        // You might want to handle this differently depending on your use case
        state.user = action.payload?.data;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Update User Info
      .addCase(updateUserInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.data;
        state.success = true;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        // If the deleted user is the current user, reset auth state
        state.isAuth = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload.data;
        state.token = action.payload.data.token;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuth = false;
        state.user = null;
        state.token = null;
        state.error = action.error.message;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetTokenAndCredential, clearError, clearSuccess } =
  userSlice.actions;
export default userSlice.reducer;
