import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('userToken');
  if (!token) return <Navigate to="/login" />;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role === 'ADMIN') return children;
    return <Navigate to="/home" />;
  } catch {
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;
