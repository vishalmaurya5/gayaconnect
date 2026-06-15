'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (roles.length && !roles.includes(user.role)) {
      router.push('/');
    }
  }, [user, loading, roles, router]);

  if (loading) return <div className="container-custom py-10">Loading...</div>;
  if (!user || (roles.length && !roles.includes(user.role))) return null;

  return children;
}
