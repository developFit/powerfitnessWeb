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
  Grid,
  Card,
  CardContent
} from "@mui/material";
import { showError, showSuccess } from "../../utils/alerts";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface Item {
  id: number;
  fecha: string;
  peso: string;
  grasaCorporal: string;
}

const AvancesNutricionales = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [nuevo, setNuevo] = useState<Item>({ id: 0, fecha: "", peso: "", grasaCorporal: "" });
  const [alumno, setAlumno] = useState("");

  const pesoData = [
    { fecha: "Ene", peso: 80 },
    { fecha: "Feb", peso: 78 },
    { fecha: "Mar", peso: 76 },
    { fecha: "Abr", peso: 74 }
  ];

  const rmData = [
    { grupo: "Pecho", rm: 100 },
    { grupo: "Espalda", rm: 120 },
    { grupo: "Piernas", rm: 150 },
    { grupo: "Hombros", rm: 80 }
  ];

  const entrenamientoData = [
    { mes: "May", diasAnterior: 18, diasActual: 20 },
    { mes: "Jun", diasAnterior: 20, diasActual: 22 }
  ];

  const asistenciaData = [
    { mes: "May", asistencias: 15 },
    { mes: "Jun", asistencias: 18 }
  ];

  const handleOpen = () => {
    setNuevo({ id: 0, fecha: "", peso: "", grasaCorporal: "" });
    setOpen(true);
  };

  const handleGuardar = () => {
    try {
      setItems([...items, { ...nuevo, id: items.length + 1 }]);
      setOpen(false);
      showSuccess('Registro guardado correctamente');
    } catch (error) {
      showError('Error al guardar registro');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Gestión de Avances Nutricionales
      </Typography>
      <TextField
        label="Buscar Alumno"
        value={alumno}
        onChange={(e) => setAlumno(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="warning" onClick={handleOpen}>
        Nuevo AvancesNutricionales
      </Button>
      <TableContainer component={Paper}sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Peso</TableCell>
              <TableCell>Grasacorporal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.fecha}</TableCell>
                <TableCell>{item.peso}</TableCell>
                <TableCell>{item.grasaCorporal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reducción de Peso
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={pesoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="peso" stroke="#FFA726" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                RM por Grupo Muscular
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={rmData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="grupo" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="rm" fill="#FFA726" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Días de Entrenamiento
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={entrenamientoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="diasAnterior" name="Mes anterior" fill="#FF7043" />
                  <Bar dataKey="diasActual" name="Mes actual" fill="#FFA726" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Asistencias
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={asistenciaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="asistencias" stroke="#FFA726" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={(e, r) => {
          if (r === 'backdropClick' || r === 'escapeKeyDown') return;
          setOpen(false);
        }}
      >
        <DialogTitle>Nuevo AvancesNutricionales</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Fecha" value={nuevo.fecha} onChange={(e) => setNuevo({ ...nuevo, fecha: e.target.value })} />
          <TextField fullWidth margin="dense" label="Peso" value={nuevo.peso} onChange={(e) => setNuevo({ ...nuevo, peso: e.target.value })} />
          <TextField fullWidth margin="dense" label="Grasacorporal" value={nuevo.grasaCorporal} onChange={(e) => setNuevo({ ...nuevo, grasaCorporal: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AvancesNutricionales;
