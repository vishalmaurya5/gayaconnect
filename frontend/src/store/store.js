import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice';
import vendor from './slices/vendorSlice';
import admin from './slices/adminSlice';
import ui from './slices/uiSlice';

const store = configureStore({
  reducer: { auth, vendor, admin, ui },
});

export default store;
