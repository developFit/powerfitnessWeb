import React, { useState, useEffect } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Tabs, Tab, Avatar
} from "@mui/material";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AlumnosService from "../../services/AlumnosService";

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
    id: 0, nombre: "", email: "", username: "", password: "", telefono: ""
  });
  const [selectedAlumno, setSelectedAlumno] = useState<Item | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    AlumnosService.getAll()
      .then((response) => {
        if (Array.isArray(response.data)) {
          setItems(response.data);
        } else {
          console.error("La respuesta no es un array:", response.data);
          setItems([]);
        }
      })
      .catch((error) => {
        console.error("Error al cargar alumnos:", error);
        setItems([]);
      });
  }, []);

  const handleOpenForm = () => {
    setNuevo({
      id: 0, nombre: "", email: "", username: "", password: "", telefono: ""
    });
    setOpenForm(true);
  };

  const handleGuardar = () => {
     console.log("Datos a guardar:", nuevo);
    AlumnosService.create(nuevo)
      .then(() => AlumnosService.getAll())
      .then((res) => {
        setItems(res.data);
        setOpenForm(false);
      })
      .catch((err) => {
        console.error("Error al guardar:", err);
      });
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

      <TableContainer component={Paper} sx={{ mt: 2, backgroundColor: "#1e1e1e" }}>
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

      {/* Dialogo para nuevo alumno */}
      <Dialog
  open={openForm}
  onClose={() => setOpenForm(false)}
  PaperProps={{
    sx: {
      backgroundColor: "#1e1e1e",
      color: "#fff",
      borderRadius: 2,
      boxShadow: 10,
    },
  }}
>
  <DialogTitle sx={{ color: "#FFA726", fontWeight: "bold" }}>
    Nuevo Alumno
  </DialogTitle>
  <DialogContent>
    <TextField
      fullWidth
      margin="dense"
      label="Nombre"
      InputLabelProps={{ style: { color: "#FFA726" } }}
      InputProps={{ style: { color: "#fff" } }}
      value={nuevo.nombre}
      onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
      sx={{ input: { borderBottom: "1px solid #FFA726" } }}
    />
    <TextField
      fullWidth
      margin="dense"
      label="Email"
      InputLabelProps={{ style: { color: "#FFA726" } }}
      InputProps={{ style: { color: "#fff" } }}
      value={nuevo.email}
      onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
    />
    <TextField
      fullWidth
      margin="dense"
      label="Username"
      InputLabelProps={{ style: { color: "#FFA726" } }}
      InputProps={{ style: { color: "#fff" } }}
      value={nuevo.username}
      onChange={(e) => setNuevo({ ...nuevo, username: e.target.value })}
    />
    <TextField
      fullWidth
      margin="dense"
      label="Contraseña"
      type="password"
      InputLabelProps={{ style: { color: "#FFA726" } }}
      InputProps={{ style: { color: "#fff" } }}
      value={nuevo.password}
      onChange={(e) => setNuevo({ ...nuevo, password: e.target.value })}
    />
    <TextField
      fullWidth
      margin="dense"
      label="Teléfono"
      InputLabelProps={{ style: { color: "#FFA726" } }}
      InputProps={{ style: { color: "#fff" } }}
      value={nuevo.telefono}
      onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })}
    />
  </DialogContent>
  <DialogActions sx={{ padding: 2 }}>
    <Button
      onClick={() => setOpenForm(false)}
      sx={{ color: "#ccc" }}
    >
      Cancelar
    </Button>
    <Button
      variant="contained"
      onClick={handleGuardar}
      sx={{
        backgroundColor: "#FFA726",
        color: "#000",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: "#ff9800",
        },
      }}
    >
      Guardar
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default Alumnos;