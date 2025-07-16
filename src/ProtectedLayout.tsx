import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from './services/AuthService';
import Layout from './layout/Layout';

const ProtectedLayout = () => {
  // Obtenemos el token y el rol guardados durante el login
  const token = AuthService.getToken();
  const role = AuthService.getRole();

  // Si no existe token o el rol no es admin redirigimos a la pantalla de ingreso
  if (!token || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedLayout;
