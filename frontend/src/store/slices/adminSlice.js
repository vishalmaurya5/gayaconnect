import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardStatsApi, getRevenueAnalyticsApi } from '../../services/adminService';

export const loadAdminDashboard = createAsyncThunk('admin/dashboard', getDashboardStatsApi);
export const loadAdminRevenue = createAsyncThunk('admin/revenue', getRevenueAnalyticsApi);

const adminSlice = createSlice({
  name: 'admin',
  initialState: { stats: null, revenue: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAdminDashboard.pending, (state) => { state.loading = true; })
      .addCase(loadAdminDashboard.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
      .addCase(loadAdminRevenue.fulfilled, (state, action) => { state.revenue = action.payload; });
  },
});

export default adminSlice.reducer;
