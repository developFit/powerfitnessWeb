import React, { useEffect, useState } from "react";
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
  MenuItem
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RutinasService from "../../services/RutinasService";
import AlumnosService from "../../services/AlumnosService";
import EjerciciosService from "../../services/EjerciciosService";
import { showError, showSuccess } from "../../utils/alerts";

interface Alumno {
  id: number;
  nombre: string;
}

interface EjercicioItem {
  id: number;
  nombre: string;
}

interface EjercicioRutina {
  idEjercicio: number;
  grupoMuscular: string;
  series: number;
  repeticiones: number;
  carga: string;
  observaciones: string;
}

interface DiaRutina {
  dia: string;
  ejercicios: EjercicioRutina[];
}

interface Rutina {
  idAlumno: number;
  nombre: string;
  objetivo: string;
  diasPorSemana: string;
  dias: DiaRutina[];
}

const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const gruposMusculares = [
  "Pecho",
  "Espalda",
  "Piernas",
  "Hombros",
  "Bíceps",
  "Tríceps",
  "Abdominales",
];

const Rutinas = () => {
  const [items, setItems] = useState<Rutina[]>([]);
  const [open, setOpen] = useState(false);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [ejercicios, setEjercicios] = useState<EjercicioItem[]>([]);
  const [rutina, setRutina] = useState<Rutina>({
    idAlumno: 0,
    nombre: '',
    objetivo: '',
    diasPorSemana: '1',
    dias: [{ dia: 'Lunes', ejercicios: [] }],
  });

  useEffect(() => {
    AlumnosService.getAll().then(r => setAlumnos(r.data));
    EjerciciosService.getAll().then(r => setEjercicios(r.data));
  }, []);

  const handleAgregarDia = () => {
    setRutina(prev => ({
      ...prev,
      dias: [...prev.dias, { dia: 'Lunes', ejercicios: [] }],
    }));
  };

  const handleAgregarEjercicio = (i: number) => {
    const copy = { ...rutina };
    copy.dias[i].ejercicios.push({
      idEjercicio: 0,
      grupoMuscular: gruposMusculares[0],
      series: 0,
      repeticiones: 0,
      carga: '',
      observaciones: '',
    });
    setRutina(copy);
  };

  const handleGuardar = async () => {
    const payload: Rutina = {
      ...rutina,
      idAlumno: Number(rutina.idAlumno),
      dias: rutina.dias.map(d => ({
        ...d,
        ejercicios: d.ejercicios.map(e => ({
          ...e,
          idEjercicio: Number(e.idEjercicio)
        }))
      }))
    };

    try {
      await RutinasService.create(payload);
      setItems([...items, payload]);
      showSuccess('Rutina guardada correctamente');
    } catch (error) {
      showError('Error al guardar rutina');
    } finally {
      setOpen(false);
      setRutina({
        idAlumno: 0,
        nombre: '',
        objetivo: '',
        diasPorSemana: '1',
        dias: [{ dia: 'Lunes', ejercicios: [] }],
      });
    }
  };

  return (
    <Box>
      <Typography variant="h5">Rutinas</Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Crear Rutina
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Alumno</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Objetivo</TableCell>
              <TableCell>Días/Semana</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((r, idx) => (
              <TableRow key={idx}>
                <TableCell>{alumnos.find(a => a.id === r.idAlumno)?.nombre || r.idAlumno}</TableCell>
                <TableCell>{r.nombre}</TableCell>
                <TableCell>{r.objetivo}</TableCell>
                <TableCell>{r.diasPorSemana}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={(e, r) => {
          if (r === 'backdropClick' || r === 'escapeKeyDown') return;
          setOpen(false);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Nueva Rutina</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Alumno</InputLabel>
            <Select
              value={rutina.idAlumno || ''}
              onChange={e => {
                const val = e.target.value;
                setRutina({ ...rutina, idAlumno: val === '' ? 0 : Number(val) });
              }}
              label="Alumno"
            >
              <MenuItem value="">
                <em>Seleccione un alumno</em>
              </MenuItem>
              {alumnos.map(a => (
                <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Nombre"
            margin="dense"
            value={rutina.nombre}
            onChange={e => setRutina({ ...rutina, nombre: e.target.value })}
          />
          <TextField
            fullWidth
            label="Objetivo"
            margin="dense"
            value={rutina.objetivo}
            onChange={e => setRutina({ ...rutina, objetivo: e.target.value })}
          />
          <TextField
            fullWidth
            label="Días por Semana"
            margin="dense"
            value={rutina.diasPorSemana}
            onChange={e => setRutina({ ...rutina, diasPorSemana: e.target.value })}
          />

          {rutina.dias.map((d, i) => (
            <Box key={i} sx={{ border: '1px solid #ccc', mt: 2, p: 2 }}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Día</InputLabel>
                <Select
                  value={d.dia}
                  onChange={e => {
                    const copy = { ...rutina };
                    copy.dias[i].dia = String(e.target.value);
                    setRutina(copy);
                  }}
                  label="Día"
                >
                  {diasSemana.map(ds => (
                    <MenuItem key={ds} value={ds}>{ds}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {d.ejercicios.map((ej, j) => (
                <Box key={j} sx={{ pl: 2, mt: 1 }}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Grupo Muscular</InputLabel>
                    <Select
                      value={ej.grupoMuscular}
                      onChange={e => {
                        const copy = { ...rutina };
                        copy.dias[i].ejercicios[j].grupoMuscular = String(e.target.value);
                        setRutina(copy);
                      }}
                      label="Grupo Muscular"
                    >
                      {gruposMusculares.map(gm => (
                        <MenuItem key={gm} value={gm}>{gm}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Ejercicio</InputLabel>
                    <Select
                      value={ej.idEjercicio || ''}
                      onChange={e => {
                        const val = e.target.value;
                        const copy = { ...rutina };
                        copy.dias[i].ejercicios[j].idEjercicio = val === '' ? 0 : Number(val);
                        setRutina(copy);
                      }}
                      label="Ejercicio"
                    >
                      <MenuItem value="">
                        <em>Seleccione un ejercicio</em>
                      </MenuItem>
                      {ejercicios.map(ex => (
                        <MenuItem key={ex.id} value={ex.id}>{ex.nombre}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Series"
                    margin="dense"
                    value={ej.series}
                    onChange={e => {
                      const copy = { ...rutina };
                      copy.dias[i].ejercicios[j].series = Number(e.target.value);
                      setRutina(copy);
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Repeticiones"
                    margin="dense"
                    value={ej.repeticiones}
                    onChange={e => {
                      const copy = { ...rutina };
                      copy.dias[i].ejercicios[j].repeticiones = Number(e.target.value);
                      setRutina(copy);
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Carga"
                    margin="dense"
                    value={ej.carga}
                    onChange={e => {
                      const copy = { ...rutina };
                      copy.dias[i].ejercicios[j].carga = e.target.value;
                      setRutina(copy);
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Observaciones"
                    margin="dense"
                    value={ej.observaciones}
                    onChange={e => {
                      const copy = { ...rutina };
                      copy.dias[i].ejercicios[j].observaciones = e.target.value;
                      setRutina(copy);
                    }}
                  />
                </Box>
              ))}
              <Button size="small" onClick={() => handleAgregarEjercicio(i)} startIcon={<AddIcon />}>
                Agregar Ejercicio
              </Button>
            </Box>
          ))}
          <Button size="small" onClick={handleAgregarDia} startIcon={<AddIcon />} sx={{ mt: 2 }}>
            Agregar Día
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Rutinas;
