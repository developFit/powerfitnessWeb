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
  CircularProgress,
} from "@mui/material";
import { showError, showSuccess } from "../../utils/alerts";
import AsistenciasService from "../../services/AsistenciasService";
import AlumnosService from "../../services/AlumnosService";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from "@mui/icons-material/Close";
import 'dayjs/locale/es';
import dayjs from "dayjs";


interface Asistencia {
  id: number;
  fecha: string;
  alumno: string;
  clase: string;
}

enum TipoAsistencia {
      PRESENCIAL,
      ONLINE
}

interface AsistenciaResponse {
  idAsistencia: number,
  alumno: AlumnoDeAsistencia,
  fecha: string,
  tipoAsistencia: TipoAsistencia,
  observaciones: string
}

interface AlumnoDeAsistencia {
  idAlumno: number,
  nombreCompleto: string
}

interface Alumno {
  idAlumno: number,
  nombre: string
}

const clases = ["Yoga", "Pilates", "Spinning"];

const Asistencias = () => {
  const [asistencias, setAsistencias] = useState<AsistenciaResponse[]>([]);
  const [open, setOpen] = useState(false);
  const [nueva, setNueva] = useState<Asistencia>({
    id: 0,
    fecha: "",
    alumno: "",
    clase: clases[0],
  });
  const [alumnos, setAlumnos] = useState<Alumno[]>();
  const [selectedAlumno, setSelectedAlumno] = useState("");
  const [selectedClase, setSelectedClase] = useState("");
  
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>();
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno>()

  useEffect(() => {
    console.log(alumnos)
    dayjs.locale('es');
    AlumnosService.getAll().then((resp) => {
      setAlumnos(resp.data)
    });

    AsistenciasService.getAll(new Date()).then((resp) => {
      setAsistencias(resp);
    })
  },[])

  const handleOpen = () => {
    setNueva({ id: 0, fecha: "", alumno: "", clase: clases[0] });
    setOpen(true);
  };

  const handleGuardar = () => {
    try {

      setOpen(false);
      showSuccess('Asistencia guardada correctamente');
    } catch (error) {
      showError('Error al guardar asistencia');
    }
  };

  const getCount = (nombre: string, dias: number) => {
    const limit = new Date();
    limit.setDate(limit.getDate() - dias);
    return asistencias;
  };

  const obtenerAsistenciasPorAlumnos = (fecha: Date) => {
    setFechaSeleccionada(fecha)
    if(alumnoSeleccionado){
      AsistenciasService.getById(alumnoSeleccionado.idAlumno, fecha).then((resp) => {
        setAsistencias(resp);
      })
    }
    else{
      AsistenciasService.getAll(fecha).then((resp) => {
        setAsistencias(resp);
      })
    }
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Gestión de Asistencias
      </Typography>
      <Button variant="contained" color="warning" onClick={handleOpen}>
        Nueva Asistencia
      </Button>

      <Box display="flex" justifyContent="space-between" gap={2} mt={2}>
        <div>
          <FormControl variant="filled" sx={{ minWidth: 180, backgroundColor:"white" }}>
            <InputLabel>Alumno</InputLabel>
            <Select
              label="Alumno"
              value={alumnoSeleccionado?.idAlumno || ""}
              onChange={(e) => {
                const alumnoEncontrado = alumnos?.find(a => a.idAlumno == e.target.value);
                if(alumnoEncontrado){
                  setAlumnoSeleccionado(alumnoEncontrado);
                  AsistenciasService.getById(alumnoEncontrado.idAlumno, fechaSeleccionada || new Date()).then((resp) => {
                    setAsistencias(resp);
                  })
                }
              }}
            >
              
              {alumnos?.map((al) => (
                <MenuItem key={al.idAlumno} value={al.idAlumno}>
                  {al.nombre}
                </MenuItem>
              ))}
              {
                alumnos == undefined && (
                  <MenuItem sx={{textAlign: "center"}} disabled>
                    <CircularProgress></CircularProgress>
                  </MenuItem>
                )
              }
            </Select>
          </FormControl>
          {
            alumnoSeleccionado && (
              <Button variant="contained" sx={{height: "100%"}} onClick={() => {
                setAlumnoSeleccionado(undefined);
                AsistenciasService.getAll(fechaSeleccionada || new Date()).then((resp) => {
                  setAsistencias(resp);
                })
              }}>
                <CloseIcon></CloseIcon>
              </Button>
            )
          }
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker views={['month', 'year']} sx={{backgroundColor:"white"}} onChange={(e) => {
              obtenerAsistenciasPorAlumnos(e?.toDate()|| new Date())
            }}/>
        </LocalizationProvider>

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
            {asistencias.map((a) => (
              <TableRow key={a.idAsistencia}>
                <TableCell>{a.fecha}</TableCell>
                <TableCell>{a.alumno.nombreCompleto}</TableCell>
                <TableCell>{a.tipoAsistencia}</TableCell>
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
      >
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
              {alumnos?.map((al) => (
                <MenuItem key={al.idAlumno} value={al.nombre}>
                  {al.nombre}
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
