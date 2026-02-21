import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/notices`;

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  targetAudience: string;
  postedBy: string;
  isImportant: boolean;
}

interface NoticeState {
  notices: Notice[];
  loading: boolean;
  error: string | null;
}

const initialState: NoticeState = {
  notices: [],
  loading: false,
  error: null,
};

// --- API ACTIONS ---

export const fetchNotices = createAsyncThunk(
  "notice/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API_URL);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch notices");
    }
  }
);

export const addNotice = createAsyncThunk(
  "notice/add",
  async (notice: Omit<Notice, "id" | "date">, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(API_URL, notice, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add notice");
    }
  }
);

export const deleteNotice = createAsyncThunk(
  "notice/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete notice");
    }
  }
);

const noticeSlice = createSlice({
  name: "notice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchNotices.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add
      .addCase(addNotice.fulfilled, (state, action) => {
        state.notices.unshift(action.payload);
      })
      // Delete
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.notices = state.notices.filter((n) => n.id !== action.payload);
      });
  },
});

export default noticeSlice.reducer;