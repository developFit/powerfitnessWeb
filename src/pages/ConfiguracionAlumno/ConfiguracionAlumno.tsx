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
import axios from "axios";

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
}

const ConfiguracionAlumno = () => {
  const [alumnos, setAlumnos] = useState<AlumnoConfiguracion[]>([]);
  const [selectedAlumno, setSelectedAlumno] = useState<AlumnoConfiguracion | null>(null);
  const [loading, setLoading] = useState(false);
  const [rutina, setRutina] = useState("");
  const [plan, setPlan] = useState("");
  const [plato, setPlato] = useState("");

  useEffect(() => {
    const lista = [
      "enriquemoncerrat@gmail.com",
      "maria@correo.com"
    ];
    const cargar = async () => {
      setLoading(true);

       // Simulación de datos
  const mockResultados: AlumnoConfiguracion[] = [
    {
      idAlumno: 1,
      nombreCompleto: "Enrique Moncerrat",
      telefono: "1122334455",
      genero: "Masculino",
      edad: "28",
      altura: "175",
      peso: "72",
      nivelDeActividadFisica: "Moderada",
      objetivos: ["Ganar masa muscular", "Definición"],
      datosAdicionales: "Prefiere entrenar por la mañana",
      email: "enriquemoncerrat@gmail.com",
      validado: false,
    },
    {
      idAlumno: 2,
      nombreCompleto: "María González",
      telefono: "1198765432",
      genero: "Femenino",
      edad: "32",
      altura: "160",
      peso: "60",
      nivelDeActividadFisica: "Alta",
      objetivos: ["Resistencia", "Bajar de peso"],
      datosAdicionales: "Dieta vegana",
      email: "maria@correo.com",
      validado: false,
    },
  ];

  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));
      const resultados: AlumnoConfiguracion[] = [];
      for (let email of lista) {
        try {
          const res = await axios.get(`http://localhost:8080/api/configuracionAlumno/${encodeURIComponent(email)}`);
          resultados.push({ ...res.data, email, validado: false });
        } catch (err) {
          console.error(err);
        }
      }
    // setAlumnos(resultados);
    setAlumnos(mockResultados);
      setLoading(false);
    };
    cargar();
  }, []);

  const handleValidar = (alumno: AlumnoConfiguracion) => {
    setSelectedAlumno(alumno);
  };

  const handleAsignar = () => {
    if (!selectedAlumno) return;
    console.log("Asignando rutina:", rutina);
    console.log("Asignando plan:", plan);
    console.log("Asignando plato:", plato);
    setAlumnos((prev) =>
      prev.map((a) =>
        a.idAlumno === selectedAlumno.idAlumno
          ? { ...a, validado: true }
          : a
      )
    );
    setSelectedAlumno(null);
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
                    {!alumno.validado && (
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
  onClose={() => setSelectedAlumno(null)}
  fullWidth
  maxWidth="md"
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
    Validar información de {selectedAlumno?.nombreCompleto}
  </DialogTitle>
  <DialogContent>
    <Typography sx={{ color: "#fff", mb: 1 }}>Edad: {selectedAlumno?.edad} años</Typography>
    <Typography sx={{ color: "#fff", mb: 1 }}>Altura: {selectedAlumno?.altura} cm</Typography>
    <Typography sx={{ color: "#fff", mb: 1 }}>Peso: {selectedAlumno?.peso} kg</Typography>
    <Typography sx={{ color: "#fff", mb: 1 }}>Objetivos: {selectedAlumno?.objetivos.join(", ")}</Typography>
    <Typography sx={{ color: "#fff", mb: 1 }}>Actividad física: {selectedAlumno?.nivelDeActividadFisica}</Typography>
    <Typography sx={{ color: "#fff", mb: 2 }}>Datos adicionales: {selectedAlumno?.datosAdicionales}</Typography>

    <TextField
      select
      label="Rutina personalizada"
      fullWidth
      margin="dense"
      value={rutina}
      onChange={(e) => setRutina(e.target.value)}
      InputLabelProps={{ style: { color: "#FFA726" } }}
      InputProps={{ style: { color: "#fff" } }}
      sx={{ mb: 2 }}
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
      InputLabelProps={{ style: { color: "#FFA726" } }}
      InputProps={{ style: { color: "#fff" } }}
      sx={{ mb: 2 }}
    >
      <MenuItem value="plan1">Plan 1</MenuItem>
      <MenuItem value="plan2">Plan 2</MenuItem>
    </TextField>

    <TextField
      select
      label="Platos sugeridos"
      fullWidth
      margin="dense"
      value={plato}
      onChange={(e) => setPlato(e.target.value)}
      InputLabelProps={{ style: { color: "#FFA726" } }}
      InputProps={{ style: { color: "#fff" } }}
    >
      <MenuItem value="plato1">Plato 1</MenuItem>
      <MenuItem value="plato2">Plato 2</MenuItem>
    </TextField>
  </DialogContent>
  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button
      onClick={() => setSelectedAlumno(null)}
      sx={{ color: "#ccc" }}
    >
      Cancelar
    </Button>
    <Button
      onClick={handleAsignar}
      variant="contained"
      sx={{
        backgroundColor: "#FFA726",
        color: "#000",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: "#ff9800",
        },
      }}
    >
      Validar y Asignar
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default ConfiguracionAlumno;
