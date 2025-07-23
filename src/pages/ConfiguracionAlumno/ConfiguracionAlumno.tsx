import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import TimelineIcon from "@mui/icons-material/Timeline";
import api from "../../services/api";
import { showError, showSuccess } from "../../utils/alerts";

interface AlumnoConfiguracion {
  idAlumno: number;
  nombreCompleto: string;
  telefono: string;
  genero: string;
  edad: string;
  altura: string;
  peso: string;
  nivelDeActividadFisica: string;
  objetivos: string[];
  datosAdicionales: string;
  email: string;
  validado: boolean;
  rutina?: string;
  plan?: string;
  platos?: string[];
}

const ConfiguracionAlumno = () => {
  const [alumnos, setAlumnos] = useState<AlumnoConfiguracion[]>([]);
  const [selectedAlumno, setSelectedAlumno] = useState<AlumnoConfiguracion | null>(null);
  const [loading, setLoading] = useState(false);
  const [rutina, setRutina] = useState("");
  const [plan, setPlan] = useState("");
  const [platos, setPlatos] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [progresoAlumno, setProgresoAlumno] = useState<AlumnoConfiguracion | null>(null);
  
  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const res = await api.get<AlumnoConfiguracion[]>("/api/getconfiguracionAlumnos");
        setAlumnos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const handleValidar = (alumno: AlumnoConfiguracion) => {
    setSelectedAlumno(alumno);
    setIsEdit(false);
    setRutina(alumno.rutina || "");
    setPlan(alumno.plan || "");
    setPlatos(alumno.platos || []);
  };

  const handleEditar = (alumno: AlumnoConfiguracion) => {
    setSelectedAlumno(alumno);
    setIsEdit(true);
    setRutina(alumno.rutina || "");
    setPlan(alumno.plan || "");
    setPlatos(alumno.platos || []);
  };

  const handleVerProgreso = (alumno: AlumnoConfiguracion) => {
    setProgresoAlumno(alumno);
  };

  const handleAsignar = async () => {
    if (!selectedAlumno) return;
    try {
      await api.put(
        `/api/alumno/${selectedAlumno.idAlumno}/rutina/${rutina}`,
        null,
        { params: { idPlanNutricional: plan } }
      );

      setAlumnos(prev =>
        prev.map(a =>
          a.idAlumno === selectedAlumno.idAlumno
            ? { ...a, validado: true, rutina, plan, platos }
            : a
        )
      );
      showSuccess('Asignación realizada');
    } catch (err) {
      console.error(err);
      showError('Error al asignar');
    } finally {
      setRutina('');
      setPlan('');
      setPlatos([]);
      setSelectedAlumno(null);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="orange">Validación de alumnos</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: "#1e1e1e" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#FFA726" }}>Nombre</TableCell>
                <TableCell sx={{ color: "#FFA726" }}>Email</TableCell>
                <TableCell sx={{ color: "#FFA726" }}>Estado</TableCell>
                <TableCell sx={{ color: "#FFA726" }}>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alumnos.map((alumno) => (
                <TableRow key={alumno.email}>
                  <TableCell sx={{ color: "#fff" }}>{alumno.nombreCompleto}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{alumno.email}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{alumno.validado ? "Validado" : "Pendiente"}</TableCell>
                  <TableCell>
                    {alumno.validado ? (
                      <>
                        <Button startIcon={<CheckIcon />} disabled color="success" variant="contained" sx={{ mr: 1 }}>
                          Validado
                        </Button>
                        <Button onClick={() => handleEditar(alumno)} startIcon={<EditIcon />} color="warning" variant="outlined" sx={{ mr: 1 }}>
                          Cambiar
                        </Button>
                        <Button onClick={() => handleVerProgreso(alumno)} startIcon={<TimelineIcon />} color="primary" variant="outlined">
                          Progreso
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => handleValidar(alumno)} color="warning" variant="contained">
                        Validar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={!!selectedAlumno}
        onClose={(e, r) => {
          if (r === 'backdropClick' || r === 'escapeKeyDown') return;
          setSelectedAlumno(null);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Validar información de {selectedAlumno?.nombreCompleto}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">Edad: {selectedAlumno?.edad} años</Typography>
          <Typography variant="subtitle1">Altura: {selectedAlumno?.altura} cm</Typography>
          <Typography variant="subtitle1">Peso: {selectedAlumno?.peso} kg</Typography>
          <Typography variant="subtitle1">Objetivos: {selectedAlumno?.objetivos.join(", ")}</Typography>
          <Typography variant="subtitle1">Actividad física: {selectedAlumno?.nivelDeActividadFisica}</Typography>
          <Typography variant="subtitle1">Datos adicionales: {selectedAlumno?.datosAdicionales}</Typography>

          <TextField
            select
            label="Rutina personalizada"
            fullWidth
            margin="dense"
            value={rutina}
            onChange={(e) => setRutina(e.target.value)}
          >
            <MenuItem value="rutina1">Rutina 1</MenuItem>
            <MenuItem value="rutina2">Rutina 2</MenuItem>
          </TextField>

          <TextField
            select
            label="Plan nutricional"
            fullWidth
            margin="dense"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          >
            <MenuItem value="plan1">Plan 1</MenuItem>
            <MenuItem value="plan2">Plan 2</MenuItem>
          </TextField>

          <TextField
            select
            label="Platos sugeridos"
            fullWidth
            margin="dense"
            SelectProps={{ multiple: true }}
            value={platos}
            onChange={(e) =>
              setPlatos(typeof e.target.value === "string" ? e.target.value.split(",") : (e.target.value as string[]))
            }
          >
            <MenuItem value="plato1">Plato 1</MenuItem>
            <MenuItem value="plato2">Plato 2</MenuItem>
            <MenuItem value="plato3">Plato 3</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedAlumno(null)} color="inherit">Cancelar</Button>
          <Button onClick={handleAsignar} color="warning" variant="contained">
            {isEdit ? "Actualizar" : "Validar y Asignar"}
          </Button>
      </DialogActions>
      </Dialog>

      <Dialog
        open={!!progresoAlumno}
        onClose={(e, r) => {
          if (r === 'backdropClick' || r === 'escapeKeyDown') return;
          setProgresoAlumno(null);
        }}
      >
        <DialogTitle>Progreso de {progresoAlumno?.nombreCompleto}</DialogTitle>
        <DialogContent>
          <Typography>Progreso no disponible en esta demo.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProgresoAlumno(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConfiguracionAlumno;
