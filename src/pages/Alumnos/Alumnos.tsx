import React, { useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Tabs, Tab, Avatar, Grid
} from "@mui/material";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AlumnosService from "../../services/AlumnosService";
import { showError, showSuccess } from "../../utils/alerts";

interface Item {
  id: number;
  nombre: string;
  email: string;
  username: string;
  password: string;
  telefono: string;
}

const Alumnos = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [nuevo, setNuevo] = useState<Item>({
    id: 0,
    nombre: "",
    email: "",
    username: "",
    password: "",
    telefono: "",
  });
  const [selectedAlumno, setSelectedAlumno] = useState<Item | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  const handleOpenForm = () => {
    setNuevo({
      id: 0,
      nombre: "",
      email: "",
      username: "",
      password: "",
      telefono: "",
    });
    setOpenForm(true);
  };

  const handleGuardar = async () => {
    try {
      await AlumnosService.create({
        nombre: nuevo.nombre,
        email: nuevo.email,
        username: nuevo.username,
        password: nuevo.password,
        telefono: nuevo.telefono,
      });
      setItems([...items, { ...nuevo, id: items.length + 1 }]);
      showSuccess('Alumno guardado correctamente');
    } catch (error) {
      showError('Error al guardar alumno');
    } finally {
      setOpenForm(false);
    }
  };

  const handleVerDetalle = (alumno: Item) => {
    setSelectedAlumno(alumno);
    setOpenDetalle(true);
  };

  // Datos de ejemplo para mostrar la evolución de fuerza en press de banca
  const fuerzaData = [
    { mes: "Ene", pressBanca: 60 },
    { mes: "Feb", pressBanca: 65 },
    { mes: "Mar", pressBanca: 70 },
    { mes: "Abr", pressBanca: 75 },
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

      <Dialog
        open={openForm}
        onClose={(e, r) => {
          if (r === 'backdropClick' || r === 'escapeKeyDown') return;
          setOpenForm(false);
        }}
      >
        <DialogTitle>Nuevo Alumno</DialogTitle>
      <DialogContent>
        <TextField fullWidth margin="dense" label="Nombre" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
        <TextField fullWidth margin="dense" label="Email" value={nuevo.email} onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })} />
        <TextField fullWidth margin="dense" label="Usuario" value={nuevo.username} onChange={(e) => setNuevo({ ...nuevo, username: e.target.value })} />
        <TextField fullWidth margin="dense" label="Contraseña" type="password" value={nuevo.password} onChange={(e) => setNuevo({ ...nuevo, password: e.target.value })} />
        <TextField fullWidth margin="dense" label="Teléfono" value={nuevo.telefono} onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })} />
      </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDetalle}
        onClose={(e, r) => {
          if (r === 'backdropClick' || r === 'escapeKeyDown') return;
          setOpenDetalle(false);
        }}
        fullWidth
        maxWidth="md"
      >
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
              <Typography color="orange" variant="subtitle1" sx={{ mt: 2 }}>Press de banca</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={fuerzaData}>
                  <Line type="monotone" dataKey="pressBanca" stroke="#FFA726" />
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
