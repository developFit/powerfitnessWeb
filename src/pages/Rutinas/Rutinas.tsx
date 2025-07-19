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
  idAlumno: number;
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
    RutinasService.getAll()
      .then(r => setItems(r.data))
      .catch(() => {});
  }, []);

  const handleAgregarDia = () => {
    setRutina(prev => ({
      ...prev,
      dias: [...prev.dias, { dia: 'Lunes', ejercicios: [] }],
    }));
  };

  const handleAgregarEjercicio = (i: number) => {
    setRutina(prev => {
      const copy = { ...prev };
      copy.dias = [...prev.dias];
      copy.dias[i] = { ...copy.dias[i] };
      copy.dias[i].ejercicios = [
        ...copy.dias[i].ejercicios,
        {
          idEjercicio: 0,
          grupoMuscular: gruposMusculares[0],
          series: 0,
          repeticiones: 0,
          carga: '',
          observaciones: '',
        },
      ];
      return copy;
    });
  };

  const handleGuardar = async () => {
    const payload: Rutina = {
      ...rutina,
      idAlumno: Number(rutina.idAlumno),
      dias: rutina.dias.map(d => ({
        ...d,
        ejercicios: d.ejercicios.map(e => ({
          ...e,
          // Ensure we never send NaN which would be serialized as null
          idEjercicio: isNaN(Number(e.idEjercicio)) ? 0 : Number(e.idEjercicio)
        }))
      }))
    };

    try {
      const response = await RutinasService.create(payload);
      const nuevo = response.data || payload;
      setItems([...items, nuevo]);
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
                <TableCell>{alumnos.find(a => a.idAlumno === r.idAlumno)?.nombre || r.idAlumno}</TableCell>
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
                <MenuItem key={a.idAlumno} value={a.idAlumno}>{a.nombre}</MenuItem>
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
                    const val = String(e.target.value);
                    setRutina(prev => {
                      const copy = { ...prev };
                      copy.dias = [...prev.dias];
                      copy.dias[i] = { ...copy.dias[i], dia: val };
                      return copy;
                    });
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
                        const val = String(e.target.value);
                        setRutina(prev => {
                          const copy = { ...prev };
                          copy.dias = [...prev.dias];
                          copy.dias[i] = { ...copy.dias[i] };
                          copy.dias[i].ejercicios = [...copy.dias[i].ejercicios];
                          copy.dias[i].ejercicios[j] = {
                            ...copy.dias[i].ejercicios[j],
                            grupoMuscular: val,
                          };
                          return copy;
                        });
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
                      value={ej.idEjercicio}
                      onChange={e => {
                        const val = e.target.value;
                        setRutina(prev => {
                          const copy = { ...prev };
                          copy.dias = [...prev.dias];
                          copy.dias[i] = { ...copy.dias[i] };
                          copy.dias[i].ejercicios = [...copy.dias[i].ejercicios];
                          copy.dias[i].ejercicios[j] = {
                            ...copy.dias[i].ejercicios[j],
                            idEjercicio: val === '' ? 0 : Number(val)
                          };
                          return copy;
                        });
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
                      const val = Number(e.target.value);
                      setRutina(prev => {
                        const copy = { ...prev };
                        copy.dias = [...prev.dias];
                        copy.dias[i] = { ...copy.dias[i] };
                        copy.dias[i].ejercicios = [...copy.dias[i].ejercicios];
                        copy.dias[i].ejercicios[j] = {
                          ...copy.dias[i].ejercicios[j],
                          series: val,
                        };
                        return copy;
                      });
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Repeticiones"
                    margin="dense"
                    value={ej.repeticiones}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setRutina(prev => {
                        const copy = { ...prev };
                        copy.dias = [...prev.dias];
                        copy.dias[i] = { ...copy.dias[i] };
                        copy.dias[i].ejercicios = [...copy.dias[i].ejercicios];
                        copy.dias[i].ejercicios[j] = {
                          ...copy.dias[i].ejercicios[j],
                          repeticiones: val,
                        };
                        return copy;
                      });
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Carga"
                    margin="dense"
                    value={ej.carga}
                    onChange={e => {
                      const val = e.target.value;
                      setRutina(prev => {
                        const copy = { ...prev };
                        copy.dias = [...prev.dias];
                        copy.dias[i] = { ...copy.dias[i] };
                        copy.dias[i].ejercicios = [...copy.dias[i].ejercicios];
                        copy.dias[i].ejercicios[j] = {
                          ...copy.dias[i].ejercicios[j],
                          carga: val,
                        };
                        return copy;
                      });
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Observaciones"
                    margin="dense"
                    value={ej.observaciones}
                    onChange={e => {
                      const val = e.target.value;
                      setRutina(prev => {
                        const copy = { ...prev };
                        copy.dias = [...prev.dias];
                        copy.dias[i] = { ...copy.dias[i] };
                        copy.dias[i].ejercicios = [...copy.dias[i].ejercicios];
                        copy.dias[i].ejercicios[j] = {
                          ...copy.dias[i].ejercicios[j],
                          observaciones: val,
                        };
                        return copy;
                      });
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
