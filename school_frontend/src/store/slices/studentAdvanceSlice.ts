import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface StudentAdvanceState {
  advanceBalance: number;
  allAdvances: Record<string, number>; // Map of admission_no -> advance_balance
  loading: boolean;
  error: string | null;
}

const initialState: StudentAdvanceState = {
  advanceBalance: 0,
  allAdvances: {},
  loading: false,
  error: null,
};

// Fetch advance balance for a specific student
export const fetchStudentAdvance = createAsyncThunk(
  'studentAdvance/fetchByAdmissionNo',
  async (admissionNo: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/fees/advance/${admissionNo}`,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch advance balance');
    }
  }
);

// Fetch all students' advance balances
export const fetchAllStudentAdvances = createAsyncThunk(
  'studentAdvance/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/fees/advance/all`,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all advances');
    }
  }
);

const studentAdvanceSlice = createSlice({
  name: 'studentAdvance',
  initialState,
  reducers: {
    clearAdvance: (state) => {
      state.advanceBalance = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch single student advance
    builder.addCase(fetchStudentAdvance.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchStudentAdvance.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.advanceBalance = action.payload.advance_balance || 0;
    });
    builder.addCase(fetchStudentAdvance.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch all student advances
    builder.addCase(fetchAllStudentAdvances.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllStudentAdvances.fulfilled, (state, action: PayloadAction<Record<string, number>>) => {
      state.loading = false;
      state.allAdvances = action.payload;
    });
    builder.addCase(fetchAllStudentAdvances.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearAdvance } = studentAdvanceSlice.actions;
export default studentAdvanceSlice.reducer;
