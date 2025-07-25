import React, { useState } from "react";
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
  IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { showError, showSuccess } from "../../utils/alerts";

interface Plato {
  idPlatoSugerido: number;
  nombre: string;
  descripcion: string;
  calorias: number;
  ingredientes: string;
}

interface Plan {
  id: number;
  nombre: string;
  desayuno: string;
  almuerzo: string;
  cena: string;
  colaciones: string[];
  platos: Plato[];
  nombreRutina: string;
  tips: string;
}

const emptyPlato: Plato = {
  idPlatoSugerido: 0,
  nombre: "",
  descripcion: "",
  calorias: 0,
  ingredientes: ""
};

const emptyPlan: Plan = {
  id: 0,
  nombre: "",
  desayuno: "",
  almuerzo: "",
  cena: "",
  colaciones: [""],
  platos: [{ ...emptyPlato }],
  nombreRutina: "",
  tips: ""
};

const PlanesNutricionales = () => {
  const [items, setItems] = useState<Plan[]>([]);
  const [open, setOpen] = useState(false);
  const [nuevo, setNuevo] = useState<Plan>(emptyPlan);

  const handleOpen = () => {
    setNuevo(emptyPlan);
    setOpen(true);
  };

  const handleAddColacion = () => {
    setNuevo((prev) => ({ ...prev, colaciones: [...prev.colaciones, ""] }));
  };

  const handleAddPlato = () => {
    setNuevo((prev) => ({
      ...prev,
      platos: [...prev.platos, { ...emptyPlato, idPlatoSugerido: prev.platos.length + 1 }]
    }));
  };

  const handleGuardar = () => {
    try {
      const nuevoPlan = { ...nuevo, id: items.length + 1 };
      setItems([...items, nuevoPlan]);
      setOpen(false);
      showSuccess("Plan guardado correctamente");
    } catch (error) {
      showError("Error al guardar plan");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Gestión de Planes Nutricionales
      </Typography>
      <Button variant="contained" color="warning" onClick={handleOpen}>
        Nuevo Plan Nutricional
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Rutina</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.id}</TableCell>
                <TableCell>{plan.nombre}</TableCell>
                <TableCell>{plan.nombreRutina}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={(e, r) => {
          if (r === "backdropClick" || r === "escapeKeyDown") return;
          setOpen(false);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Nuevo Plan Nutricional</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Nombre"
            value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Nombre de Rutina"
            value={nuevo.nombreRutina}
            onChange={(e) => setNuevo({ ...nuevo, nombreRutina: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Desayuno"
            value={nuevo.desayuno}
            onChange={(e) => setNuevo({ ...nuevo, desayuno: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Almuerzo"
            value={nuevo.almuerzo}
            onChange={(e) => setNuevo({ ...nuevo, almuerzo: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Cena"
            value={nuevo.cena}
            onChange={(e) => setNuevo({ ...nuevo, cena: e.target.value })}
          />
          <Typography sx={{ mt: 2 }}>Colaciones</Typography>
          {nuevo.colaciones.map((c, idx) => (
            <Box key={idx} display="flex" alignItems="center" gap={1} mt={1}>
              <TextField
                fullWidth
                label={`Colación ${idx + 1}`}
                value={c}
                onChange={(e) => {
                  const val = e.target.value;
                  setNuevo((prev) => {
                    const copy = { ...prev };
                    copy.colaciones = [...prev.colaciones];
                    copy.colaciones[idx] = val;
                    return copy;
                  });
                }}
              />
              <IconButton
                aria-label="delete"
                onClick={() =>
                  setNuevo((prev) => ({
                    ...prev,
                    colaciones: prev.colaciones.filter((_, i) => i !== idx)
                  }))
                }
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={handleAddColacion} sx={{ mt: 1 }}>
            Agregar Colación
          </Button>
          <Typography sx={{ mt: 2 }}>Platos</Typography>
          {nuevo.platos.map((p, idx) => (
            <Box key={idx} sx={{ border: "1px solid #ccc", p: 1, mt: 1 }}>
              <TextField
                fullWidth
                label="Nombre"
                margin="dense"
                value={p.nombre}
                onChange={(e) => {
                  const val = e.target.value;
                  setNuevo((prev) => {
                    const copy = { ...prev };
                    copy.platos = [...prev.platos];
                    copy.platos[idx] = { ...copy.platos[idx], nombre: val };
                    return copy;
                  });
                }}
              />
              <TextField
                fullWidth
                label="Descripción"
                margin="dense"
                value={p.descripcion}
                onChange={(e) => {
                  const val = e.target.value;
                  setNuevo((prev) => {
                    const copy = { ...prev };
                    copy.platos = [...prev.platos];
                    copy.platos[idx] = { ...copy.platos[idx], descripcion: val };
                    return copy;
                  });
                }}
              />
              <TextField
                fullWidth
                label="Calorías"
                margin="dense"
                type="number"
                value={p.calorias}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setNuevo((prev) => {
                    const copy = { ...prev };
                    copy.platos = [...prev.platos];
                    copy.platos[idx] = { ...copy.platos[idx], calorias: val };
                    return copy;
                  });
                }}
              />
              <TextField
                fullWidth
                label="Ingredientes"
                margin="dense"
                value={p.ingredientes}
                onChange={(e) => {
                  const val = e.target.value;
                  setNuevo((prev) => {
                    const copy = { ...prev };
                    copy.platos = [...prev.platos];
                    copy.platos[idx] = { ...copy.platos[idx], ingredientes: val };
                    return copy;
                  });
                }}
              />
              <IconButton
                aria-label="delete"
                onClick={() =>
                  setNuevo((prev) => ({
                    ...prev,
                    platos: prev.platos.filter((_, i) => i !== idx)
                  }))
                }
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={handleAddPlato} sx={{ mt: 1 }}>
            Agregar Plato
          </Button>
          <TextField
            fullWidth
            margin="dense"
            label="Tips"
            value={nuevo.tips}
            onChange={(e) => setNuevo({ ...nuevo, tips: e.target.value })}
          />
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

export default PlanesNutricionales;

