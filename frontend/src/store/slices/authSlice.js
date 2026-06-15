import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi, logoutApi } from '../../services/authService';

const savedUser = null;

export const login = createAsyncThunk('auth/login', async (payload) => {
  const data = await loginApi(payload);
  return data;
});

export const register = createAsyncThunk('auth/register', async (payload) => {
  const data = await registerApi(payload);
  return data;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: savedUser, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(register.fulfilled, (state, action) => { state.user = action.payload.user; })
      .addCase(logout.fulfilled, (state) => { state.user = null; });
  },
});

export default authSlice.reducer;
