import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchVendors, fetchVendorBySlug } from '../../services/vendorService';

export const loadVendors = createAsyncThunk('vendor/loadVendors', async (params) => fetchVendors(params));
export const loadVendorDetail = createAsyncThunk('vendor/loadVendorDetail', async (slug) => fetchVendorBySlug(slug));

const vendorSlice = createSlice({
  name: 'vendor',
  initialState: { list: [], total: 0, detail: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadVendors.pending, (s) => { s.loading = true; })
      .addCase(loadVendors.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.data || []; s.total = a.payload.total || 0; })
      .addCase(loadVendorDetail.fulfilled, (s, a) => { s.detail = a.payload; });
  }
});

export default vendorSlice.reducer;
