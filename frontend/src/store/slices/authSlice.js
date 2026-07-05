import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi, logoutApi, resetPasswordApi } from '../../services/authService';
import { TOKEN_KEY, REFRESH_KEY, USER_KEY } from '../../services/api';

const persistAuth = (data) => {
  if (typeof window === 'undefined' || !data) return;
  try {
    if (data.token) window.localStorage.setItem(TOKEN_KEY, data.token);
    if (data.refreshToken) window.localStorage.setItem(REFRESH_KEY, data.refreshToken);
    if (data.user) window.localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  } catch {
    /* ignore storage errors */
  }
};

const clearAuth = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
    window.localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore storage errors */
  }
};

const loadUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const login = createAsyncThunk('auth/login', async (payload) => {
  const data = await loginApi(payload);
  return data;
});

export const register = createAsyncThunk('auth/register', async (payload) => {
  const data = await registerApi(payload);
  return data;
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, password }) => {
  const data = await resetPasswordApi(token, password);
  return data;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: loadUser(), loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; persistAuth(action.payload); state.user = action.payload.user; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; persistAuth(action.payload); state.user = action.payload.user; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(resetPassword.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(resetPassword.fulfilled, (state, action) => { state.loading = false; persistAuth(action.payload); state.user = action.payload.user; })
      .addCase(resetPassword.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(logout.fulfilled, (state) => { clearAuth(); state.user = null; });
  },
});

export default authSlice.reducer;
