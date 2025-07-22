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
  MenuItem,
  IconButton
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RutinasService from "../../services/RutinasService";
import AlumnosService from "../../services/AlumnosService";
import EjerciciosService from "../../services/EjerciciosService";
import { showError, showSuccess } from "../../utils/alerts";
import { toNumberOrZero } from "../../utils/number";

interface Alumno {
  idAlumno: number;
  nombre: string;
}

interface EjercicioItem {
  id: number | string;
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

const emptyRutina: Rutina = {
  idAlumno: 0,
  nombre: '',
  objetivo: '',
  diasPorSemana: '1',
  dias: [{ dia: 'Lunes', ejercicios: [] }]
};

const Rutinas = () => {
  const [items, setItems] = useState<Rutina[]>([]);
  const [open, setOpen] = useState(false);
  const [detalle, setDetalle] = useState<Rutina | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [ejercicios, setEjercicios] = useState<EjercicioItem[]>([]);
  const [rutina, setRutina] = useState<Rutina>(emptyRutina);

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

  const handleEditar = (index: number) => {
    setEditingIndex(index);
    const current = items[index];
    setRutina({
      ...emptyRutina,
      ...current,
      dias: Array.isArray((current as any).dias) ? (current as any).dias : emptyRutina.dias
    });
    setOpen(true);
  };

  const handleEliminar = async (index: number) => {
    try {
      const current = items[index] as any;
      if (current && current.id) {
        await RutinasService.delete(current.id);
      }
      setItems(items.filter((_, i) => i !== index));
      showSuccess('Rutina eliminada');
    } catch {
      showError('Error al eliminar rutina');
    }
  };

  const handleVerDetalle = (item: Rutina) => {
    setDetalle(item);
  };

  const handleExport = () => {
    const header = ['Alumno', 'Nombre', 'Objetivo', 'DiasPorSemana'];
    const rows = items.map(r => [
      alumnos.find(a => a.idAlumno === r.idAlumno)?.nombre || r.idAlumno,
      r.nombre,
      r.objetivo,
      r.diasPorSemana
    ]);
    let csv = header.join(',') + '\n';
    csv += rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rutinas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGuardar = async () => {
    const payload: Rutina = {
      ...rutina,
      idAlumno: Number(rutina.idAlumno),
      dias: (rutina.dias || []).map(d => ({
        ...d,
        ejercicios: (d.ejercicios || []).map(e => ({
          ...e,
          idEjercicio: toNumberOrZero(e.idEjercicio)
        }))
      }))
    };

    try {
      if (editingIndex !== null) {
        const current = items[editingIndex] as any;
        if (current && current.id) {
          await RutinasService.update(current.id, payload);
        }
        const updated = current && current.id ? { ...payload, id: current.id } : payload;
        setItems(items.map((it, idx) => idx === editingIndex ? updated : it));
        showSuccess('Rutina actualizada');
      } else {
        const response = await RutinasService.create(payload);
        const nuevo = response.data || payload;
        setItems([...items, nuevo]);
        showSuccess('Rutina guardada correctamente');
      }
    } catch (error) {
      showError('Error al guardar rutina');
    } finally {
      setOpen(false);
      setEditingIndex(null);
      setRutina(emptyRutina);
    }
  };

  return (
    <Box>
      <Typography variant="h5">Rutinas</Typography>
      <Box display="flex" gap={1}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Crear Rutina
        </Button>
        <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExport}>
          Exportar
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Objetivo</TableCell>
              <TableCell>Días/Semana</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((r, idx) => (
              <TableRow key={idx}>
                <TableCell>{r.nombre}</TableCell>
                <TableCell>{r.objetivo}</TableCell>
                <TableCell>{r.diasPorSemana}</TableCell>
                <TableCell>
                  <IconButton color="info" onClick={() => handleVerDetalle(r)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handleEditar(idx)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleEliminar(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
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
          setEditingIndex(null);
          setRutina(emptyRutina);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>{editingIndex !== null ? 'Editar Rutina' : 'Nueva Rutina'}</DialogTitle>
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

          {rutina.dias?.map((d, i) => (
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
                      value={ej.idEjercicio === 0 ? '' : ej.idEjercicio}
                      onChange={e => {
                        const val = e.target.value;
                        console.log('Ejercicio seleccionado:', val);
                        setRutina(prev => {
                          const copy = { ...prev };
                          copy.dias = [...prev.dias];
                          copy.dias[i] = { ...copy.dias[i] };
                          copy.dias[i].ejercicios = [...copy.dias[i].ejercicios];
                          const parsed = parseInt(val as string, 10);
                          console.log('Parsed ID:', parsed);
                          if (Number.isNaN(parsed)) {
                            copy.dias[i].ejercicios[j] = {
                              ...copy.dias[i].ejercicios[j],
                              idEjercicio: 0,
                            };
                          }
                          copy.dias[i].ejercicios[j] = {
                            ...copy.dias[i].ejercicios[j],
                            idEjercicio: Number.isNaN(parsed) ? 0 : parsed
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
                        <MenuItem key={ex.idEjercicio} value={Number(ex.idEjercicio)}>{ex.nombre}</MenuItem>
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

      <Dialog
        open={!!detalle}
        onClose={(e, r) => {
          if (r === 'backdropClick' || r === 'escapeKeyDown') return;
          setDetalle(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalle de {alumnos.find(a => a.idAlumno === detalle?.idAlumno)?.nombre}
        </DialogTitle>
        <DialogContent dividers>
          {detalle && (
            <Box>
              <Typography><strong>Nombre:</strong> {detalle.nombre}</Typography>
              <Typography><strong>Objetivo:</strong> {detalle.objetivo}</Typography>
              <Typography><strong>Días por semana:</strong> {detalle.diasPorSemana}</Typography>
              {detalle?.dias?.map((d, i) => (
                <Box key={i} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">{d.dia}</Typography>
                  {d.ejercicios?.map((e, j) => (
                    <Box key={j} sx={{ pl: 2 }}>
                      <Typography>- Grupo: {e.grupoMuscular}</Typography>
                      <Typography>- Series: {e.series}</Typography>
                      <Typography>- Repeticiones: {e.repeticiones}</Typography>
                      <Typography>- Carga: {e.carga}</Typography>
                      {e.observaciones && (
                        <Typography>- Obs: {e.observaciones}</Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalle(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Rutinas;
