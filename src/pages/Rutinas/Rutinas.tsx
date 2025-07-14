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
     <Button
  variant="contained"
  onClick={() => setOpenRutina(true)}
  sx={{
    backgroundColor: "#FFA726",
    color: "#000",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#ff9800",
    },
    mt: 1,
    mb: 2
  }}
>
  Crear Nueva Rutina
</Button>

 <TableContainer
  component={Paper}
  sx={{
    mt: 2,
    backgroundColor: "#1e1e1e",
    borderRadius: 2,
    boxShadow: 5,
  }}
>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell sx={{ color: "#FFA726", fontWeight: "bold" }}>Alumno</TableCell>
        <TableCell sx={{ color: "#FFA726", fontWeight: "bold" }}>Nivel</TableCell>
        <TableCell sx={{ color: "#FFA726", fontWeight: "bold" }}>Activa</TableCell>
        <TableCell sx={{ color: "#FFA726", fontWeight: "bold" }}>Fecha</TableCell>
        <TableCell sx={{ color: "#FFA726", fontWeight: "bold" }}>Acciones</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {items.map((r) => (
        <TableRow
          key={r.id}
          sx={{
            backgroundColor: r.activa ? "#2a2a2a" : "#1e1e1e",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          <TableCell sx={{ color: "#fff" }}>{r.emailAlumno}</TableCell>
          <TableCell sx={{ color: "#fff" }}>{r.nivelRutina}</TableCell>
          <TableCell sx={{ color: "#fff" }}>{r.activa ? "Sí" : "No"}</TableCell>
          <TableCell sx={{ color: "#fff" }}>{r.fechaAsignacion}</TableCell>
          <TableCell>
            <IconButton onClick={() => handleEditarRutina(r)} sx={{ color: "#FFA726" }}>
              <EditIcon />
            </IconButton>
            <Button
              size="small"
              onClick={() => handleActivarRutina(r.id!)}
              sx={{
                backgroundColor: "#FFA726",
                color: "#000",
                fontWeight: "bold",
                ml: 1,
                "&:hover": {
                  backgroundColor: "#fb8c00",
                },
              }}
            >
              Activar
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

    <Dialog
  open={openRutina}
  onClose={() => setOpenRutina(false)}
  maxWidth="lg"
  fullWidth
  PaperProps={{
    sx: {
      backgroundColor: "#1e1e1e",
      color: "#fff",
      borderRadius: 2,
      boxShadow: 10,
    },
  }}
>
  <DialogTitle sx={{ color: "#FFA726", fontWeight: "bold" }}>
    {modoEdicion ? "Editar Rutina" : "Alta de Rutina Semanal"}
  </DialogTitle>
  <DialogContent>
    <TextField
      fullWidth
      label="Email del Alumno"
      value={rutina.emailAlumno}
      onChange={(e) => setRutina({ ...rutina, emailAlumno: e.target.value })}
      margin="dense"
      InputLabelProps={{ style: { color: "#FFA726" } }}
      InputProps={{ style: { color: "#fff" } }}
    />
    <TextField
      fullWidth
      label="Nivel de Rutina"
      value={rutina.nivelRutina}
      onChange={(e) => setRutina({ ...rutina, nivelRutina: e.target.value })}
      margin="dense"
      InputLabelProps={{ style: { color: "#FFA726" } }}
      InputProps={{ style: { color: "#fff" } }}
    />

    {rutina.seccionCorporalList.map((sec, i) => (
      <Box key={i} sx={{ border: "1px solid #444", mt: 2, p: 2, borderRadius: 1 }}>
        <Typography variant="h6" color="#FFA726">{sec.dia}</Typography>

        {["nombre", "tiempo", "calorias", "imagen"].map((field) => (
          <TextField
            key={field}
            fullWidth
            label={field === "nombre"
              ? "Nombre Sección"
              : field === "tiempo"
              ? "Tiempo Total"
              : field === "calorias"
              ? "Calorías"
              : "Imagen URL"}
            value={(sec as any)[field]}
            onChange={(e) => {
              const copy = [...rutina.seccionCorporalList];
              (copy[i] as any)[field] = field === "calorias" ? +e.target.value : e.target.value;
              setRutina({ ...rutina, seccionCorporalList: copy });
            }}
            margin="dense"
            InputLabelProps={{ style: { color: "#FFA726" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
        ))}

        {sec.rondas.map((ronda, j) => (
          <Box key={j} sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="#FFA726">Ronda {ronda.numeroRonda}</Typography>
            {["tiempo", "calorias"].map((field) => (
              <TextField
                key={field}
                fullWidth
                label={field === "tiempo" ? "Tiempo" : "Calorías"}
                value={(ronda as any)[field]}
                onChange={(e) => {
                  const copy = [...rutina.seccionCorporalList];
                  (copy[i].rondas[j] as any)[field] =
                    field === "calorias" ? +e.target.value : e.target.value;
                  setRutina({ ...rutina, seccionCorporalList: copy });
                }}
                margin="dense"
                InputLabelProps={{ style: { color: "#FFA726" } }}
                InputProps={{ style: { color: "#fff" } }}
              />
            ))}

            {ronda.ejerciciosDeRonda.map((ej, k) => (
              <Box key={k} sx={{ pl: 2, pt: 1 }}>
                <FormControl fullWidth margin="dense">
                  <InputLabel sx={{ color: "#FFA726" }}>Ejercicio</InputLabel>
                  <Select
                    value={ej.idEjercicio}
                    onChange={(e) => {
                      const copy = [...rutina.seccionCorporalList];
                      copy[i].rondas[j].ejerciciosDeRonda[k].idEjercicio = +e.target.value;
                      setRutina({ ...rutina, seccionCorporalList: copy });
                    }}
                    sx={{ color: "#fff" }}
                  >
                    {ejerciciosDisponibles.map((e) => (
                      <MenuItem key={e.id} value={e.id}>
                        {e.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {["tiempo", "repeticiones", "nivelEjercicio", "peso"].map((field) => (
                  <TextField
                    key={field}
                    fullWidth
                    label={
                      field === "tiempo"
                        ? "Tiempo"
                        : field === "repeticiones"
                        ? "Repeticiones"
                        : field === "nivelEjercicio"
                        ? "Nivel"
                        : "Peso (kg)"
                    }
                    value={(ej as any)[field]}
                    onChange={(e) => {
                      const copy = [...rutina.seccionCorporalList];
                      (copy[i].rondas[j].ejerciciosDeRonda[k] as any)[field] =
                        field === "peso" || field === "repeticiones"
                          ? +e.target.value
                          : e.target.value;
                      setRutina({ ...rutina, seccionCorporalList: copy });
                    }}
                    margin="dense"
                    InputLabelProps={{ style: { color: "#FFA726" } }}
                    InputProps={{ style: { color: "#fff" } }}
                  />
                ))}
              </Box>
            ))}

            <Button
              size="small"
              onClick={() => handleAgregarEjercicio(i, j)}
              sx={{ color: "#FFA726", fontWeight: "bold", mt: 1 }}
            >
              Agregar Ejercicio
            </Button>
          </Box>
        ))}

        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => handleAgregarRonda(i)}
          sx={{ color: "#FFA726", fontWeight: "bold", mt: 2 }}
        >
          Agregar Ronda
        </Button>
      </Box>
    ))}
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button onClick={() => setOpenRutina(false)} sx={{ color: "#ccc" }}>
      Cancelar
    </Button>
    <Button
      variant="contained"
      onClick={handleGuardarRutina}
      sx={{
        backgroundColor: "#FFA726",
        color: "#000",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: "#fb8c00",
        },
      }}
    >
      Guardar
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default Rutinas;