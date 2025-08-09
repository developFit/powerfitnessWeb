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
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import TimelineIcon from "@mui/icons-material/Timeline";
import api from "../../services/api";
import RutinasService from "../../services/RutinasService";
import PlanesNutricionalesService from "../../services/PlanesNutricionalesService";
import { showError, showSuccess } from "../../utils/alerts";

interface Rutina {
  idRutina: number;
  nivelRutina: string;
  nombre: string;
  objetivo: string;
  diasPorSemana: number;
  tiempo: string;
  imagenUrl: string;
  // ... otros campos que necesites
}

interface Plan {
  idPlanNutrcional: number; // Nota: tiene typo en la API (Nutrcional)
  desayuno: string;
  almuerzo: string;
  cena: string;
  colaciones: string[];
  nombreRutina: string;
  tips: string;
  // ... otros campos
}

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
  rutina?: Rutina; // 🔧 Ahora es un objeto, no string
  rutinaActiva: boolean;
  plan?: Plan;     // 🔧 Ahora es un objeto, no string
  planActivo: boolean;
  platos?: string[];
}

// 1. Corregir la interface para reflejar la estructura real
interface RutinaDisponible {
  idRutina: number; // 🔧 Cambiar de 'id' a 'idRutina'
  nombre: string;
  objetivo: string;
  diasPorSemana: number;
}

interface PlanDisponible {
  idPlan?: number;           // Para rutinas disponibles
  idPlanNutrcional?: number; // Para el plan asignado (con typo de la API)
  nombre: string;
}

const ConfiguracionAlumno = () => {
  const [alumnos, setAlumnos] = useState<AlumnoConfiguracion[]>([]);
  const [selectedAlumno, setSelectedAlumno] = useState<AlumnoConfiguracion | null>(null);
  const [loading, setLoading] = useState(false);
  const [rutina, setRutina] = useState<string>("");
  const [plan, setPlan] = useState<string>("");
  const [platos, setPlatos] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [progresoAlumno, setProgresoAlumno] = useState<AlumnoConfiguracion | null>(null);
  const [rutinasDisponibles, setRutinasDisponibles] = useState<RutinaDisponible[]>([]);
  const [planesDisponibles, setPlanesDisponibles] = useState<PlanDisponible[]>([]);
  
  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const res = await api.get<AlumnoConfiguracion[]>("/api/getconfiguracionAlumnos");
        console.log('Alumnos cargados:', res.data);
        setAlumnos(res.data);
        
        const rutRes = await RutinasService.getAll();
        console.log('Rutinas response completo:', rutRes);
        console.log('Rutinas data estructura:', rutRes.data);
        console.log('Primera rutina:', rutRes.data[0]);
        setRutinasDisponibles(rutRes.data || []);
        
        const planRes = await PlanesNutricionalesService.getAll();
        console.log('Planes response completo:', planRes);
        console.log('Planes data estructura:', planRes.data);
        setPlanesDisponibles(planRes.data || []);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const handleValidar = (alumno: AlumnoConfiguracion) => {
    setSelectedAlumno(alumno);
    setIsEdit(false);
    
    console.log('handleValidar - alumno:', alumno);
    console.log('handleValidar - rutinasDisponibles:', rutinasDisponibles);
    
    // 🔧 Ahora rutina es un objeto, no un string
    const rutinaAsignada = alumno.rutina;
    const planAsignado = alumno.plan;
    
    console.log('handleValidar - rutinaAsignada:', rutinaAsignada);
    console.log('handleValidar - planAsignado:', planAsignado);
    
    // Precargar los valores en los selects
    const rutinaValue = rutinaAsignada?.idRutina ? String(rutinaAsignada.idRutina) : "";
    const planValue = planAsignado?.idPlanNutrcional ? String(planAsignado.idPlanNutrcional) : "";
    
    console.log('handleValidar - rutina preseleccionada:', rutinaValue);
    console.log('handleValidar - plan preseleccionado:', planValue);
    
    setRutina(rutinaValue);
    setPlan(planValue);
    setPlatos(alumno.platos || []);
  };

  const handleEditar = (alumno: AlumnoConfiguracion) => {
    setSelectedAlumno(alumno);
    setIsEdit(true);
    
    // 🔧 Precargar datos del alumno para edición
    const rutinaAsignada = alumno.rutina;
    const planAsignado = alumno.plan;
    
    const rutinaValue = rutinaAsignada?.idRutina ? String(rutinaAsignada.idRutina) : "";
    const planValue = planAsignado?.idPlanNutrcional ? String(planAsignado.idPlanNutrcional) : "";
    
    console.log('handleEditar - rutina preseleccionada:', rutinaValue);
    console.log('handleEditar - plan preseleccionado:', planValue);
    
    setRutina(rutinaValue);
    setPlan(planValue);
    setPlatos(alumno.platos || []);
  };

  const handleVerProgreso = (alumno: AlumnoConfiguracion) => {
    setProgresoAlumno(alumno);
  };

  const handleAsignar = async () => {
    if (!selectedAlumno) return;
    
    // Validar que se haya seleccionado al menos una rutina
    if (!rutina) {
      showError('Debe seleccionar una rutina');
      return;
    }
    
    try {
      const rutinaId = Number(rutina);
      const planId = plan ? Number(plan) : null;
      
      console.log('Asignando:', { rutinaId, planId, planSeleccionado: !!plan });
      
      // Construir la URL y parámetros condicionalmente
      const url = `/api/alumno/${selectedAlumno.idAlumno}/rutina/${rutinaId}`;
      const config: any = {};
      
      // Solo agregar el parámetro si se seleccionó un plan
      if (planId !== null && planId !== 0) {
        config.params = { idPlanNutricional: planId };
        console.log('Enviando con plan nutricional:', planId);
      } else {
        console.log('Sin plan nutricional seleccionado');
      }
      
      await api.put(url, null, config);

      // 🔧 Buscar los objetos completos para actualizar el estado
      const rutinaCompleta = rutinasDisponibles.find(r => r.idRutina === rutinaId);
      const planCompleto = planId ? planesDisponibles.find(p => (p.idPlan || p.id) === planId) : null;
      
      console.log('Rutina completa encontrada:', rutinaCompleta);
      console.log('Plan completo encontrado:', planCompleto);
      
      setAlumnos(prev =>
        prev.map(a =>
          a.idAlumno === selectedAlumno.idAlumno
            ? { 
                ...a, 
                validado: true,
                rutinaActiva: true,
                planActivo: !!planCompleto,
                rutina: rutinaCompleta ? {
                  idRutina: rutinaCompleta.idRutina,
                  nombre: rutinaCompleta.nombre,
                  objetivo: rutinaCompleta.objetivo,
                  diasPorSemana: rutinaCompleta.diasPorSemana,
                  // ... otros campos necesarios
                } as Rutina : undefined,
                plan: planCompleto ? {
                  idPlanNutrcional: planCompleto.idPlan || planCompleto.id,
                  nombreRutina: planCompleto.nombre,
                  // ... otros campos necesarios
                } as Plan : undefined,
                platos 
              }
            : a
        )
      );
      
      const mensaje = planId 
        ? 'Rutina y plan nutricional asignados correctamente' 
        : 'Rutina asignada correctamente';
      showSuccess(mensaje);
      
    } catch (err) {
      console.error('Error al asignar:', err);
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
          
          {/* 🆕 Mostrar rutina y plan actuales si existen */}
          {selectedAlumno?.rutina && (
            <Typography variant="subtitle2" color="success.main" sx={{ mt: 1 }}>
              ✅ Rutina actual: {selectedAlumno.rutina.nombre} ({selectedAlumno.rutina.objetivo})
            </Typography>
          )}
          {selectedAlumno?.plan && (
            <Typography variant="subtitle2" color="success.main">
              ✅ Plan actual: {selectedAlumno.plan.nombreRutina}
            </Typography>
          )}

          <FormControl fullWidth margin="dense">
            <InputLabel id="rutina-select-label">Rutina personalizada</InputLabel>
            <Select
              labelId="rutina-select-label"
              id="rutina-select"
              value={rutina || ''}
              onChange={(event) => {
                const value = event.target.value as string;
                console.log('Rutina Select - Valor seleccionado:', value, typeof value);
                
                if (value !== undefined && value !== null && value !== "undefined") {
                  if (value === "") {
                    console.log('Valor vacío, limpiando rutina');
                    setRutina("");
                  } else {
                    console.log('Valor válido, actualizando rutina a:', value);
                    setRutina(value);
                  }
                } else {
                  console.error('Valor inválido recibido:', value);
                }
              }}
              label="Rutina personalizada"
            >
              <MenuItem value="">
                <em>Seleccione una rutina</em>
              </MenuItem>
              {rutinasDisponibles
                .filter(r => r && r.idRutina !== undefined && r.idRutina !== null && r.nombre)
                .map(r => {
                  console.log('Creando MenuItem para rutina:', r);
                  const idString = String(r.idRutina);
                  return (
                    <MenuItem key={`rutina-${r.idRutina}`} value={idString}>
                      {r.nombre}
                    </MenuItem>
                  );
                })
              }
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Plan nutricional</InputLabel>
            <Select
              value={plan || ''}
              onChange={(e) => {
                const value = e.target.value;
                console.log('Plan Select - Value raw:', value);
                console.log('Plan Select - Value tipo:', typeof value);
                
                if (value !== undefined && value !== null && value !== "undefined") {
                  setPlan(String(value));
                } else if (value === "") {
                  setPlan("");
                }
              }}
              label="Plan nutricional"
              displayEmpty
            >
              <MenuItem value="">
                <em>Seleccione un plan</em>
              </MenuItem>
              {planesDisponibles
                .filter(p => p && p.id !== undefined && p.id !== null && p.nombre)
                .map(p => (
                  <MenuItem key={`plan-${p.id}`} value={String(p.id)}>
                    {p.nombre}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>

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
