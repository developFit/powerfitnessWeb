import React, { useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Tabs, Tab, Avatar, Grid
} from "@mui/material";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Item {
  id: number;
  nombre: string;
  email: string;
}

const Alumnos = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [nuevo, setNuevo] = useState<Item>({ id: 0, nombre: "", email: "" });
  const [selectedAlumno, setSelectedAlumno] = useState<Item | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  const handleOpenForm = () => {
    setNuevo({ id: 0, nombre: "", email: "" });
    setOpenForm(true);
  };

  const handleGuardar = () => {
    setItems([...items, { ...nuevo, id: items.length + 1 }]);
    setOpenForm(false);
  };

  const handleVerDetalle = (alumno: Item) => {
    setSelectedAlumno(alumno);
    setOpenDetalle(true);
  };

  const pesoData = [
    { mes: "Ene", peso: 75 },
    { mes: "Feb", peso: 74 },
    { mes: "Mar", peso: 72 },
    { mes: "Abr", peso: 71 },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="orange">Gestión de Alumnos</Typography>
      <Button variant="contained" color="warning" onClick={handleOpenForm}>
        Nuevo Alumno
      </Button>
      <TableContainer compozxczcnent={Paper} sx={{ mt: 2, backgroundColor: "#1e1e1e" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#FFA726" }}>ID</TableCell>
              <TableCell sx={{ color: "#FFA726" }}>Nombre</TableCell>
              <TableCell sx={{ color: "#FFA726" }}>Email</TableCell>
              <TableCell sx={{ color: "#FFA726" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ color: "#fff" }}>{item.id}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{item.nombre}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{item.email}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="warning" onClick={() => handleVerDetalle(item)}>Detalle</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Nuevo Alumno</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Nombre" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
          <TextField fullWidth margin="dense" label="Email" value={nuevo.email} onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDetalle} onClose={() => setOpenDetalle(false)} fullWidth maxWidth="md">
        <DialogTitle>Detalle de {selectedAlumno?.nombre}</DialogTitle>
        <DialogContent dividers>
          <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)}>
            <Tab label="Progreso" />
            <Tab label="Datos personales" />
            <Tab label="Objetivos y Rutinas" />
          </Tabs>
          {tabIndex === 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography color="orange" variant="subtitle1">Fotos de progreso</Typography>
              <Box display="flex" gap={2} my={1}>
                <Avatar src="/img/progreso1.jpg" sx={{ width: 80, height: 80 }} />
                <Avatar src="/img/progreso2.jpg" sx={{ width: 80, height: 80 }} />
              </Box>
              <Typography color="orange" variant="subtitle1" sx={{ mt: 2 }}>Peso corporal</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={pesoData}>
                  <Line type="monotone" dataKey="peso" stroke="#FFA726" />
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
          {tabIndex === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography color="orange">Nombre: {selectedAlumno?.nombre}</Typography>
              <Typography color="orange">Email: {selectedAlumno?.email}</Typography>
              {/* Agregar más info real si está disponible */}
            </Box>
          )}
          {tabIndex === 2 && (
            <Box sx={{ mt: 2 }}>
              <Typography color="orange">Objetivos: Ganar masa muscular</Typography>
              <Typography color="orange">Rutina asignada: Rutina A</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetalle(false)} color="inherit">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Alumnos;
