'use client';

import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import store from '@/src/store/store';

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
    </Provider>
  );
}
