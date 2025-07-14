import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

interface Asistencia {
  id: number;
  fecha: string;
  alumno: string;
  clase: string;
}

const alumnos = ["Juan Pérez", "María López", "Carlos Díaz"];
const clases = ["Yoga", "Pilates", "Spinning"];

const Asistencias = () => {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [open, setOpen] = useState(false);
  const [nueva, setNueva] = useState<Asistencia>({
    id: 0,
    fecha: "",
    alumno: alumnos[0],
    clase: clases[0],
  });

  const [selectedAlumno, setSelectedAlumno] = useState("");
  const [selectedClase, setSelectedClase] = useState("");

  const handleOpen = () => {
    setNueva({ id: 0, fecha: "", alumno: alumnos[0], clase: clases[0] });
    setOpen(true);
  };

  const handleGuardar = () => {
    setAsistencias([...asistencias, { ...nueva, id: asistencias.length + 1 }]);
    setOpen(false);
  };

  const filtered = asistencias.filter(
    (a) =>
      (selectedAlumno ? a.alumno === selectedAlumno : true) &&
      (selectedClase ? a.clase === selectedClase : true)
  );

  const getCount = (nombre: string, dias: number) => {
    const limit = new Date();
    limit.setDate(limit.getDate() - dias);
    return asistencias.filter(
      (a) => a.alumno === nombre && new Date(a.fecha) >= limit
    ).length;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Gestión de Asistencias
      </Typography>
      <Button variant="contained" color="warning" onClick={handleOpen}>
        Nueva Asistencia
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Alumno</TableCell>
              <TableCell>Semanal</TableCell>
              <TableCell>Mensual</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alumnos.map((al) => (
              <TableRow key={al}>
                <TableCell>{al}</TableCell>
                <TableCell>{getCount(al, 7)}</TableCell>
                <TableCell>{getCount(al, 30)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" gap={2} mt={2}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Alumno</InputLabel>
          <Select
            label="Alumno"
            value={selectedAlumno}
            onChange={(e) => setSelectedAlumno(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {alumnos.map((al) => (
              <MenuItem key={al} value={al}>
                {al}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Clase</InputLabel>
          <Select
            label="Clase"
            value={selectedClase}
            onChange={(e) => setSelectedClase(e.target.value)}
          >
            <MenuItem value="">Todas</MenuItem>
            {clases.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Alumno</TableCell>
              <TableCell>Clase</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.fecha}</TableCell>
                <TableCell>{a.alumno}</TableCell>
                <TableCell>{a.clase}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nueva Asistencia</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            fullWidth
            margin="dense"
            label="Fecha"
            InputLabelProps={{ shrink: true }}
            value={nueva.fecha}
            onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Alumno</InputLabel>
            <Select
              label="Alumno"
              value={nueva.alumno}
              onChange={(e) => setNueva({ ...nueva, alumno: e.target.value })}
            >
              {alumnos.map((al) => (
                <MenuItem key={al} value={al}>
                  {al}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Clase</InputLabel>
            <Select
              label="Clase"
              value={nueva.clase}
              onChange={(e) => setNueva({ ...nueva, clase: e.target.value })}
            >
              {clases.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Asistencias;
