import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

interface Pago {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
}

interface Alumno {
  id: number;
  nombre: string;
  deuda: number;
  pagos: Pago[];
}

const CuentasCorrientes = () => {
  const [alumnos] = useState<Alumno[]>([
    {
      id: 1,
      nombre: "Juan Pérez",
      deuda: 1500,
      pagos: [
        { id: 1, descripcion: "Cuota Enero", monto: 1000, fecha: "2024-01-05" },
        { id: 2, descripcion: "Clase adicional", monto: 500, fecha: "2024-01-10" },
      ],
    },
    {
      id: 2,
      nombre: "María Gómez",
      deuda: 800,
      pagos: [{ id: 1, descripcion: "Cuota Enero", monto: 1200, fecha: "2024-01-02" }],
    },
  ]);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);

  const handleVerDetalle = (alumno: Alumno) => {
    setSelectedAlumno(alumno);
    setOpenDetalle(true);
  };

  const totalPagos = alumnos.reduce(
    (acc, a) => acc + a.pagos.reduce((s, p) => s + p.monto, 0),
    0
  );
  const totalDeudas = alumnos.reduce((acc, a) => acc + a.deuda, 0);
  const totalPagadoAlumno = selectedAlumno
    ? selectedAlumno.pagos.reduce((sum, p) => sum + p.monto, 0)
    : 0;

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="orange">
        Cuentas Corrientes
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ backgroundColor: "#fff" }}>
            <CardContent>
              <Typography variant="subtitle1" color="#000">
                Pagos Recibidos del Mes
              </Typography>
              <Typography variant="h5" color="#000">
                ${totalPagos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ backgroundColor: "#fff" }}>
            <CardContent>
              <Typography variant="subtitle1" color="#000">
                Deuda Total de Alumnos
              </Typography>
              <Typography variant="h5" color="#000">
                ${totalDeudas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Alumno</TableCell>
              <TableCell>Deuda Mensual</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alumnos.map((al) => (
              <TableRow key={al.id}>
                <TableCell>{al.id}</TableCell>
                <TableCell>{al.nombre}</TableCell>
                <TableCell>${al.deuda}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => handleVerDetalle(al)}
                  >
                    Ver Detalle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDetalle}
        onClose={() => setOpenDetalle(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Detalle de {selectedAlumno?.nombre}</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Descripción</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedAlumno?.pagos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.descripcion}</TableCell>
                  <TableCell>${p.monto}</TableCell>
                  <TableCell>{p.fecha}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box mt={2}>
            <Typography variant="subtitle1" color="orange">
              Total Pagado: ${totalPagadoAlumno}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetalle(false)} color="inherit">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CuentasCorrientes;
