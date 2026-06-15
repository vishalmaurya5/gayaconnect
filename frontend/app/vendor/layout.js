'use client';

import ProtectedRoute from '@/components/common/ProtectedRoute';

export default function VendorLayout({ children }) {
  return (
    <ProtectedRoute roles={['vendor', 'admin']}>
      <div className="space-y-6">
        {children}
      </div>
    </ProtectedRoute>
  );
}
