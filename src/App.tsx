import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Alumnos from "./pages/Alumnos/Alumnos";
import Rutinas from "./pages/Rutinas/Rutinas";
import Platos from "./pages/Platos/Platos";
import PlanesNutricionales from "./pages/PlanesNutricionales/PlanesNutricionales";
import Asistencias from "./pages/Asistencias/Asistencias";
import AvancesNutricionales from "./pages/AvancesNutricionales/AvancesNutricionales";
import CuentasCorrientes from "./pages/CuentasCorrientes/CuentasCorrientes";
import PlanesYCuotasPendientes from "./pages/PlanesYCuotasPendientes/PlanesYCuotasPendientes";
import ConfiguracionAlumno from "./pages/ConfiguracionAlumno/ConfiguracionAlumno";
import Login from "./pages/Login/Login";
import ProtectedLayout from "./ProtectedLayout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedLayout />}> 
        <Route path="/" element={<Home />} />
        <Route path="/alumnos" element={<Alumnos />} />
        <Route path="/ConfiguracionAlumnos" element={<ConfiguracionAlumno />} />
        <Route path="/rutinas" element={<Rutinas />} />
        <Route path="/platos" element={<Platos />} />
        <Route path="/planes" element={<PlanesNutricionales />} />
        <Route path="/asistencias" element={<Asistencias />} />
        <Route path="/avances" element={<AvancesNutricionales />} />
        <Route path="/cuentas" element={<CuentasCorrientes />} />
        <Route path="/cuotas" element={<PlanesYCuotasPendientes />} />
      </Route>
    </Routes>
  );
}

export default App;
