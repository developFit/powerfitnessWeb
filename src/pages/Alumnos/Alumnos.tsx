import React, { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Tabs, Tab, Avatar, Grid
} from "@mui/material";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AlumnosService from "../../services/AlumnosService";
import { showError, showSuccess } from "../../utils/alerts";

interface Item {
  idAlumno: number;
  tipoAlumno: string;
  nombre: string;
  objetivos: string;
  nivelDeActividadFisica: string;
  nombreCompleto: string;
  telefono: string;
  genero: string;
  edad: string;
  altura: string;
  peso: string;
  datosAdicionales: string;
  email?: string;
  username?: string;
  password?: string;
}

const Alumnos = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [nuevo, setNuevo] = useState<Item>({
    idAlumno: 0,
    tipoAlumno: "",
    nombre: "",
    objetivos: "",
    nivelDeActividadFisica: "",
    nombreCompleto: "",
    telefono: "",
    genero: "",
    edad: "",
    altura: "",
    peso: "",
    datosAdicionales: "",
    email: "",
    username: "",
    password: "",
  });
  const [selectedAlumno, setSelectedAlumno] = useState<Item | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    AlumnosService.getAll()
      .then(r => setItems(r.data))
      .catch(() => showError('Error al cargar alumnos'));
  }, []);

  const handleOpenForm = () => {
    setNuevo({
      idAlumno: 0,
      tipoAlumno: "",
      nombre: "",
      objetivos: "",
      nivelDeActividadFisica: "",
      nombreCompleto: "",
      telefono: "",
      genero: "",
      edad: "",
      altura: "",
      peso: "",
      datosAdicionales: "",
      email: "",
      username: "",
      password: "",
    });
    setOpenForm(true);
  };

  const handleGuardar = async () => {
    try {
      const response = await AlumnosService.create(nuevo);
      const guardado = response.data || nuevo;
      setItems([...items, guardado]);
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
      <TableContainer component={Paper} sx={{ mt: 2, backgroundColor: "#1e1e1e" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#FFA726" }}>ID</TableCell>
              <TableCell sx={{ color: "#FFA726" }}>Nombre</TableCell>
              <TableCell sx={{ color: "#FFA726" }}>Teléfono</TableCell>
              <TableCell sx={{ color: "#FFA726" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.idAlumno}>
                <TableCell sx={{ color: "#fff" }}>{item.idAlumno}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{item.nombre}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{item.telefono}</TableCell>
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
              <Typography color="orange">Nombre: {selectedAlumno?.nombreCompleto}</Typography>
              <Typography color="orange">Teléfono: {selectedAlumno?.telefono}</Typography>
              <Typography color="orange">Edad: {selectedAlumno?.edad}</Typography>
              <Typography color="orange">Altura: {selectedAlumno?.altura}</Typography>
              <Typography color="orange">Peso: {selectedAlumno?.peso}</Typography>
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
