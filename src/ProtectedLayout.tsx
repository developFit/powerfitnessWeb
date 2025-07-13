import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from './services/AuthService';
import Layout from './layout/Layout';

const ProtectedLayout = () => {
  const token = AuthService.getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedLayout;
