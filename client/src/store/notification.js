import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Notification API endpoints
export const getAllNotifications = createAsyncThunk(
  "notification/getAll",
  async (_, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/notification/getAll`,
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

export const getNotificationById = createAsyncThunk(
  "notification/getById",
  async (id, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/notification/get/${id}`,
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

export const getNotificationsByRecipient = createAsyncThunk(
  "notification/getByRecipient",
  async (recipientId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/notification/recipient/${recipientId}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getNotificationsByType = createAsyncThunk(
  "notification/getByType",
  async (type, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/notification/type/${type}`,
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

export const getUnreadCount = createAsyncThunk(
  "notification/getUnreadCount",
  async (recipientId, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/api/notification/unread-count/${recipientId}`,
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

export const createNotification = createAsyncThunk(
  "notification/create",
  async (formData, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/notification/create`,
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

export const updateNotification = createAsyncThunk(
  "notification/update",
  async ({ id, formData }, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/notification/update/${id}`,
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

export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/notification/patch/${id}/read`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (recipientId, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${
          import.meta.env.VITE_API_URL
        }/api/notification/recipient/${recipientId}/read-all`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notification/delete",
  async (id, { getState }) => {
    const token = getState().user?.token || sessionStorage.getItem("token");
    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/notification/delete/${id}`,
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
  notifications: [],
  currentNotification: null,
  recipientNotifications: [],
  typeNotifications: [],
  unreadCount: 0,
  error: null,
  success: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentNotification: (state) => {
      state.currentNotification = null;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Notifications
      .addCase(getAllNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Notification By ID
      .addCase(getNotificationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNotificationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentNotification = action.payload?.data || null;
        state.error = null;
      })
      .addCase(getNotificationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Notifications By Recipient
      .addCase(getNotificationsByRecipient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNotificationsByRecipient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipientNotifications = action.payload?.data || [];
        state.error = null;
        state.unreadCount = action.payload?.unreadCount || 0;
      })
      .addCase(getNotificationsByRecipient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Notifications By Type
      .addCase(getNotificationsByType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNotificationsByType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.typeNotifications = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getNotificationsByType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Unread Count
      .addCase(getUnreadCount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unreadCount = action.payload?.data?.count || 0;
        state.error = null;
      })
      .addCase(getUnreadCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Create Notification
      .addCase(createNotification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications.push(action.payload?.data);
        state.unreadCount += 1;
        state.success = true;
        state.error = null;
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Update Notification
      .addCase(updateNotification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.notifications.findIndex(
          (notification) => notification._id === action.payload?.data?._id
        );
        if (index !== -1) {
          state.notifications[index] = action.payload.data;
        }
        if (
          state.currentNotification &&
          state.currentNotification._id === action.payload?.data?._id
        ) {
          state.currentNotification = action.payload.data;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Mark As Read
      .addCase(markAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.notifications.findIndex(
          (notification) => notification._id === action.payload?.data?._id
        );
        if (index !== -1) {
          state.notifications[index] = action.payload.data;
        }
        if (
          state.currentNotification &&
          state.currentNotification._id === action.payload?.data?._id
        ) {
          state.currentNotification = action.payload.data;
        }
        state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.error = null;
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Mark All As Read
      .addCase(markAllAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.isLoading = false;
        state.notifications = state.notifications.map((notification) => ({
          ...notification,
          read: true,
        }));
        state.recipientNotifications = state.recipientNotifications.map(
          (notification) => ({
            ...notification,
            read: true,
          })
        );
        state.unreadCount = 0;
        state.error = null;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Delete Notification
      .addCase(deleteNotification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedNotification = state.notifications.find(
          (notification) => notification._id === action.payload?.data?._id
        );

        state.notifications = state.notifications.filter(
          (notification) => notification._id !== action.payload?.data?._id
        );

        if (
          state.currentNotification &&
          state.currentNotification._id === action.payload?.data?._id
        ) {
          state.currentNotification = null;
        }

        // Decrement unread count if the deleted notification was unread
        if (deletedNotification && !deletedNotification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }

        state.success = true;
        state.error = null;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  clearCurrentNotification,
  incrementUnreadCount,
  decrementUnreadCount,
  resetUnreadCount,
} = notificationSlice.actions;
export default notificationSlice.reducer;
