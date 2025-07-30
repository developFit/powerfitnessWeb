import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import AddIcon from "@mui/icons-material/Add";
import PlanesMembresiaService from "../../services/PlanesMembresiaService";
import { showError, showSuccess } from "../../utils/alerts";

enum EstadoPlan {
  ACTIVO = "ACTIVO",
  INACTIVO = "INACTIVO"
}

interface Plan {
  idPlan: number;
  nombre: string;
  precio: number;
  descripcion: string;
  estado: EstadoPlan.ACTIVO | EstadoPlan.INACTIVO;
}

const emptyPlan: Plan = {
  idPlan: 0,
  nombre: "",
  precio: 0,
  descripcion: "",
  estado: EstadoPlan.ACTIVO,
};

const PlanesMembresia = () => {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [open, setOpen] = useState(false);
  const [actual, setActual] = useState<Plan>(emptyPlan);

  useEffect(() => {
    PlanesMembresiaService.getAll()
      .then((r) => setPlanes(r.data))
      .catch(() => {});
  }, []);

  const handleGuardar = async () => {
    try {
      if (actual.idPlan) {
        await PlanesMembresiaService.update(actual.idPlan, actual);
        setPlanes(planes.map((p) => (p.idPlan === actual.idPlan ? actual : p)));
        showSuccess("Plan actualizado");
      } else {
        const response = await PlanesMembresiaService.create(actual);
        showSuccess(response.data);
        location.href = location.href
      }
    } catch (e) {
      showError("Error al guardar plan");
    } finally {
      setOpen(false);
      setActual(emptyPlan);
    }
  };

  const handleEditar = (plan: Plan) => {
    setActual(plan);
    setOpen(true);
  };

  const handleToggleEstado = async (plan: Plan) => {
    let nuevoEstado = plan.estado;
    if(plan.estado == EstadoPlan.ACTIVO){
      nuevoEstado = EstadoPlan.INACTIVO;
    }
    else{
      nuevoEstado = EstadoPlan.ACTIVO;
    }
    try {
      await PlanesMembresiaService.update(plan.idPlan, { ...plan, estado: nuevoEstado });
      setPlanes(
        planes.map((p) => (p.idPlan === plan.idPlan ? { ...p, estado: nuevoEstado } : p))
      );
      showSuccess("Estado actualizado");
    } catch {
      showError("Error al actualizar estado");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Planes de Membresía
      </Typography>
      <Button
        variant="contained"
        color="warning"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Nuevo Plan
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {planes.map((p) => (
              <TableRow key={p.idPlan}>
                <TableCell>{p.nombre}</TableCell>
                <TableCell>{p.precio}</TableCell>
                <TableCell>{p.descripcion}</TableCell>
                <TableCell>{p.estado}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditar(p)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color={p.estado === EstadoPlan.INACTIVO ? "warning" : "success"}
                    onClick={() => handleToggleEstado(p)}
                  >
                    {p.estado === EstadoPlan.INACTIVO ? <ToggleOffIcon /> : <ToggleOnIcon />}
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
          if (r === "backdropClick" || r === "escapeKeyDown") return;
          setOpen(false);
          setActual(emptyPlan);
        }}
      >
        <DialogTitle>{actual.idPlan ? "Editar Plan" : "Nuevo Plan"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Nombre"
            value={actual.nombre}
            onChange={(e) => setActual({ ...actual, nombre: e.target.value })}
          />
          <TextField
            fullWidth
            type="number"
            margin="dense"
            label="Precio"
            onChange={(e) => setActual({ ...actual, precio: Number(e.target.value) })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Descripción"
            value={actual.descripcion}
            onChange={(e) => setActual({ ...actual, descripcion: e.target.value })}
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

export default PlanesMembresia;
