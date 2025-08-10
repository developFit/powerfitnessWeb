import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PlanesMembresiaService from "../../services/PlanesMembresiaService";
import AlumnosService from "../../services/AlumnosService";
import { showError, showSuccess } from "../../utils/alerts";

interface Pago {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
}

interface Plan {
  idPlan: number;
  nombre: string;
}

interface Alumno {
  idAlumno: number;
  nombre: string;
  deuda?: number;
  pagos?: Pago[];
}

const CuentasCorrientes = () => {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | "">("");
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [openAsignar, setOpenAsignar] = useState(false);
  const [alumnoAsignar, setAlumnoAsignar] = useState<Alumno | null>(null);
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);

  useEffect(() => {
    PlanesMembresiaService.getAll()
      .then((r) => setPlanes(r.data))
      .catch(() => showError("Error al cargar planes"));
    AlumnosService.getAll()
      .then((r) => setAlumnos(r.data))
      .catch(() => showError("Error al cargar alumnos"));
  }, []);

  const handleVerDetalle = (alumno: Alumno) => {
    setSelectedAlumno(alumno);
    setOpenDetalle(true);
  };

  const totalPagos = alumnos.reduce(
    (acc, a) => acc + (a.pagos?.reduce((s, p) => s + p.monto, 0) || 0),
    0
  );
  const totalDeudas = alumnos.reduce((acc, a) => acc + (a.deuda || 0), 0);
  const totalPagadoAlumno = selectedAlumno
    ? selectedAlumno.pagos?.reduce((sum, p) => sum + p.monto, 0) || 0
    : 0;

  const handleOpenAsignarPlan = (alumno: Alumno) => {
    setAlumnoAsignar(alumno);
    setSelectedPlanId("");
    setOpenAsignar(true);
  };

  const handleAsignarPlan = async () => {
    if (!selectedPlanId || !alumnoAsignar) {
      showError("Seleccione un plan");
      return;
    }
    try {
      await PlanesMembresiaService.assignPlanToAlumno(
        Number(selectedPlanId),
        alumnoAsignar.idAlumno,
        "PENDIENTE"
      );
      showSuccess("Plan asignado correctamente");
      setOpenAsignar(false);
      setAlumnoAsignar(null);
      setSelectedPlanId("");
    } catch (error) {
      console.error("Error al asignar plan", error);
      showError("Error al asignar plan");
    }
  };

  const handleCloseAsignar = () => {
    setOpenAsignar(false);
    setAlumnoAsignar(null);
    setSelectedPlanId("");
  };


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
              <TableRow key={al.idAlumno}>
                <TableCell>{al.idAlumno}</TableCell>
                <TableCell>{al.nombre}</TableCell>
                <TableCell>${al.deuda || 0}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => handleVerDetalle(al)}
                  >
                    Ver Detalle
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenAsignarPlan(al)}
                    sx={{ ml: 1 }}
                  >
                    Asignar Plan
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openAsignar}
        onClose={(e, r) => {
          if (r === 'backdropClick' || r === 'escapeKeyDown') return;
          handleCloseAsignar();
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Asignar Plan a {alumnoAsignar?.nombre}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="plan-modal-select-label">Seleccionar Plan</InputLabel>
            <Select
              labelId="plan-modal-select-label"
              value={selectedPlanId}
              label="Seleccionar Plan"
              onChange={(e) => setSelectedPlanId(Number(e.target.value))}
            >
              {planes.map((plan) => (
                <MenuItem key={plan.idPlan} value={plan.idPlan}>
                  {plan.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAsignar} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleAsignarPlan} color="primary" variant="contained">
            Asignar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDetalle}
        onClose={(e, r) => {
          if (r === 'backdropClick' || r === 'escapeKeyDown') return;
          setOpenDetalle(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Detalle de {selectedAlumno?.nombre}</DialogTitle>
        <DialogContent>
          {selectedAlumno && (
            <Box mb={2}>
              <Typography variant="body1" color="textSecondary">
                Deuda Mensual: ${selectedAlumno.deuda || 0}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Total Pagado: ${totalPagadoAlumno}
              </Typography>
            </Box>
          )}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Descripción</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedAlumno?.pagos?.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.descripcion}</TableCell>
                  <TableCell>${p.monto}</TableCell>
                  <TableCell>{p.fecha}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
