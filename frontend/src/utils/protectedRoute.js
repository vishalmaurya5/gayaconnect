import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, roles = [] }) {
  const user = useSelector((s) => s.auth.user);
  if (!user) return React.createElement(Navigate, { to: '/login', replace: true });
  if (roles.length && !roles.includes(user.role)) {
    return React.createElement(Navigate, { to: '/', replace: true });
  }
  return children;
}
