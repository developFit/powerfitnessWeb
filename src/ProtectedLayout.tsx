import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from './services/AuthService';
import Layout from './layout/Layout';

const ProtectedLayout = () => {
  // Obtenemos el token guardado durante el login
  const token = AuthService.getToken();

  // Si no existe token redirigimos a la pantalla de ingreso
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
