import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/fees`;

export const fetchAllFeeDues = createAsyncThunk(
  "feeDues/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/fee-dues/all`);
      return res.data; // Returns object map: { admission_no: due_amount }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch all fee dues"
      );
    }
  }
);

export const fetchFeeDueByAdmissionNo = createAsyncThunk(
  "feeDues/fetchByAdmissionNo",
  async (admissionNo: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/fee-dues/${admissionNo}`);
      return res.data; // { admission_no, due_amount }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch fee dues"
      );
    }
  }
);

type FeeDuesState = {
  loading: boolean;
  dueAmount: number;
  admissionNo: string | null;
  allDues: Record<string, number>; // Map of admission_no -> due_amount
  error: string | null;
};

const initialState: FeeDuesState = {
  loading: false,
  dueAmount: 0,
  admissionNo: null,
  allDues: {},
  error: null,
};

const feeDuesSlice = createSlice({
  name: "feeDues",
  initialState,
  reducers: {
    clearFeeDues(state) {
      state.dueAmount = 0;
      state.admissionNo = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFeeDues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFeeDues.fulfilled, (state, action) => {
        state.loading = false;
        state.allDues = action.payload || {};
      })
      .addCase(fetchAllFeeDues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFeeDueByAdmissionNo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeDueByAdmissionNo.fulfilled, (state, action) => {
        state.loading = false;
        state.dueAmount = Number(action.payload?.due_amount || 0);
        state.admissionNo = action.payload?.admission_no || null;
      })
      .addCase(fetchFeeDueByAdmissionNo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.dueAmount = 0;
      });
  },
});

export const { clearFeeDues } = feeDuesSlice.actions;
export default feeDuesSlice.reducer;
