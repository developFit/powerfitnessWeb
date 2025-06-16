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
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface Ejercicio {
  id: number;
  nombre: string;
  explicacion: string;
  urlVideo: string;
}

interface EjercicioRonda {
  idEjercicio: number;
  tiempo: string;
  repeticiones: number;
  nivelEjercicio: string;
  peso: number;
}

interface Ronda {
  numeroRonda: number;
  tiempo: string;
  calorias: number;
  ejerciciosDeRonda: EjercicioRonda[];
}

interface SeccionCorporal {
  dia: string;
  nombre: string;
  tiempo: string;
  calorias: number;
  imagen: string;
  rondas: Ronda[];
}

interface Rutina {
  id?: number;
  emailAlumno: string;
  nivelRutina: string;
  activa?: boolean;
  fechaAsignacion?: string;
  seccionCorporalList: SeccionCorporal[];
}

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const Rutinas = () => {
  const [items, setItems] = useState<Rutina[]>([]);
  const [openRutina, setOpenRutina] = useState(false);
  const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState<Ejercicio[]>([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [rutinaEditandoId, setRutinaEditandoId] = useState<number | null>(null);

  const [rutina, setRutina] = useState<Rutina>({
    emailAlumno: "",
    nivelRutina: "",
    seccionCorporalList: diasSemana.map(dia => ({
      dia,
      nombre: "",
      tiempo: "",
      calorias: 0,
      imagen: "",
      rondas: []
    }))
  });

  useEffect(() => {
    setEjerciciosDisponibles([
      { id: 1, nombre: "Sentadillas", explicacion: "Piernas", urlVideo: "https://youtu.be/xxx1" },
      { id: 2, nombre: "Flexiones", explicacion: "Pecho", urlVideo: "https://youtu.be/xxx2" },
      { id: 3, nombre: "Abdominales", explicacion: "Core", urlVideo: "https://youtu.be/xxx3" },
    ]);
  }, []);

  const handleGuardarRutina = () => {
    let nuevas: Rutina[];

    if (modoEdicion && rutinaEditandoId != null) {
      nuevas = items.map(r =>
        r.id === rutinaEditandoId ? { ...rutina, id: rutinaEditandoId, activa: r.activa, fechaAsignacion: r.fechaAsignacion } : r
      );
    } else {
      const actualizadas = items.map(r =>
        r.emailAlumno === rutina.emailAlumno ? { ...r, activa: false } : r
      );

      const nueva: Rutina = {
        ...rutina,
        id: items.length + 1,
        fechaAsignacion: new Date().toISOString().split('T')[0],
        activa: true
      };

      nuevas = [...actualizadas, nueva];
    }

    setItems(nuevas);
    setOpenRutina(false);
    setModoEdicion(false);
    setRutinaEditandoId(null);
  };

  const handleEditarRutina = (r: Rutina) => {
    setRutina(r);
    setModoEdicion(true);
    setRutinaEditandoId(r.id ?? null);
    setOpenRutina(true);
  };

  const handleActivarRutina = (id: number) => {
    const actualizadas = items.map(r => ({ ...r, activa: r.id === id }));
    setItems(actualizadas);
  };

  const handleAgregarRonda = (i: number) => {
    const updated = [...rutina.seccionCorporalList];
    updated[i].rondas.push({ numeroRonda: updated[i].rondas.length + 1, tiempo: '', calorias: 0, ejerciciosDeRonda: [] });
    setRutina({ ...rutina, seccionCorporalList: updated });
  };

  const handleAgregarEjercicio = (i: number, j: number) => {
    const updated = [...rutina.seccionCorporalList];
    updated[i].rondas[j].ejerciciosDeRonda.push({ idEjercicio: 0, tiempo: '', repeticiones: 0, nivelEjercicio: '', peso: 0 });
    setRutina({ ...rutina, seccionCorporalList: updated });
  };

  return (
    <Box>
      <Typography variant="h5">Gestión de Rutinas</Typography>
      <Button variant="contained" onClick={() => setOpenRutina(true)}>Crear Nueva Rutina</Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Alumno</TableCell>
              <TableCell>Nivel</TableCell>
              <TableCell>Activa</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((r) => (
              <TableRow key={r.id} sx={{ backgroundColor: r.activa ? '#e0f7fa' : 'inherit' }}>
                <TableCell>{r.emailAlumno}</TableCell>
                <TableCell>{r.nivelRutina}</TableCell>
                <TableCell>{r.activa ? 'Sí' : 'No'}</TableCell>
                <TableCell>{r.fechaAsignacion}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditarRutina(r)}><EditIcon /></IconButton>
                  <Button size="small" onClick={() => handleActivarRutina(r.id!)}>Activar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openRutina} onClose={() => setOpenRutina(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{modoEdicion ? 'Editar Rutina' : 'Alta de Rutina Semanal'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Email del Alumno" value={rutina.emailAlumno} onChange={(e) => setRutina({ ...rutina, emailAlumno: e.target.value })} margin="dense" />
          <TextField fullWidth label="Nivel de Rutina" value={rutina.nivelRutina} onChange={(e) => setRutina({ ...rutina, nivelRutina: e.target.value })} margin="dense" />

          {rutina.seccionCorporalList.map((sec, i) => (
            <Box key={i} sx={{ border: '1px solid #ccc', mt: 2, p: 2 }}>
              <Typography variant="h6">{sec.dia}</Typography>
              <TextField fullWidth label="Nombre Sección" value={sec.nombre} onChange={(e) => {
                const copy = [...rutina.seccionCorporalList];
                copy[i].nombre = e.target.value;
                setRutina({ ...rutina, seccionCorporalList: copy });
              }} margin="dense" />
              <TextField fullWidth label="Tiempo Total" value={sec.tiempo} onChange={(e) => {
                const copy = [...rutina.seccionCorporalList];
                copy[i].tiempo = e.target.value;
                setRutina({ ...rutina, seccionCorporalList: copy });
              }} margin="dense" />
              <TextField fullWidth label="Calorías" value={sec.calorias} onChange={(e) => {
                const copy = [...rutina.seccionCorporalList];
                copy[i].calorias = +e.target.value;
                setRutina({ ...rutina, seccionCorporalList: copy });
              }} margin="dense" />
              <TextField fullWidth label="Imagen URL" value={sec.imagen} onChange={(e) => {
                const copy = [...rutina.seccionCorporalList];
                copy[i].imagen = e.target.value;
                setRutina({ ...rutina, seccionCorporalList: copy });
              }} margin="dense" />

              {sec.rondas.map((ronda, j) => (
                <Box key={j} sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Ronda {ronda.numeroRonda}</Typography>
                  <TextField fullWidth label="Tiempo" value={ronda.tiempo} onChange={(e) => {
                    const copy = [...rutina.seccionCorporalList];
                    copy[i].rondas[j].tiempo = e.target.value;
                    setRutina({ ...rutina, seccionCorporalList: copy });
                  }} margin="dense" />
                  <TextField fullWidth label="Calorías" value={ronda.calorias} onChange={(e) => {
                    const copy = [...rutina.seccionCorporalList];
                    copy[i].rondas[j].calorias = +e.target.value;
                    setRutina({ ...rutina, seccionCorporalList: copy });
                  }} margin="dense" />

                  {ronda.ejerciciosDeRonda.map((ej, k) => (
                    <Box key={k} sx={{ pl: 2 }}>
                      <FormControl fullWidth margin="dense">
                        <InputLabel>Ejercicio</InputLabel>
                        <Select value={ej.idEjercicio} onChange={(e) => {
                          const copy = [...rutina.seccionCorporalList];
                          copy[i].rondas[j].ejerciciosDeRonda[k].idEjercicio = +e.target.value;
                          setRutina({ ...rutina, seccionCorporalList: copy });
                        }}>
                          {ejerciciosDisponibles.map(e => <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>)}
                        </Select>
                      </FormControl>
                      <TextField fullWidth label="Tiempo" value={ej.tiempo} onChange={(e) => {
                        const copy = [...rutina.seccionCorporalList];
                        copy[i].rondas[j].ejerciciosDeRonda[k].tiempo = e.target.value;
                        setRutina({ ...rutina, seccionCorporalList: copy });
                      }} margin="dense" />
                      <TextField fullWidth label="Repeticiones" value={ej.repeticiones} onChange={(e) => {
                        const copy = [...rutina.seccionCorporalList];
                        copy[i].rondas[j].ejerciciosDeRonda[k].repeticiones = +e.target.value;
                        setRutina({ ...rutina, seccionCorporalList: copy });
                      }} margin="dense" />
                      <TextField fullWidth label="Nivel" value={ej.nivelEjercicio} onChange={(e) => {
                        const copy = [...rutina.seccionCorporalList];
                        copy[i].rondas[j].ejerciciosDeRonda[k].nivelEjercicio = e.target.value;
                        setRutina({ ...rutina, seccionCorporalList: copy });
                      }} margin="dense" />
                      <TextField fullWidth label="Peso (kg)" value={ej.peso} onChange={(e) => {
                        const copy = [...rutina.seccionCorporalList];
                        copy[i].rondas[j].ejerciciosDeRonda[k].peso = +e.target.value;
                        setRutina({ ...rutina, seccionCorporalList: copy });
                      }} margin="dense" />
                    </Box>
                  ))}
                  <Button size="small" onClick={() => handleAgregarEjercicio(i, j)}>Agregar Ejercicio</Button>
                </Box>
              ))}
              <Button size="small" startIcon={<AddIcon />} onClick={() => handleAgregarRonda(i)}>
                Agregar Ronda
              </Button>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRutina(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardarRutina}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Rutinas;