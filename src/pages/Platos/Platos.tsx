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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlatosService from "../../services/PlatosService";
import api from "../../services/api";
import { showError, showSuccess } from "../../utils/alerts";

const Platos = () => {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [platoIdEditar, setPlatoIdEditar] = useState<number | null>(null);

  const [nuevo, setNuevo] = useState({
    id: 0,
    nombre: "",
    descripcion: "",
    calorias: "",
    imagen: "",
    ingredientes: "",
    planNutricional: {
      idPlanNutrcional: 1,
      nombre: "",
      descripcion: "",
      duracionSemanal: 1,
      caloriasObjetivo: 1,
    },
  });

  useEffect(() => {
    cargarPlatos();
  }, []);

  const cargarPlatos = async () => {
    try {
      const response = await api.get("/api/platosSugeridos");
      setItems(response.data);
    } catch (error) {
      showError("Error al cargar platos");
    }
  };

  const handleOpen = () => {
    setNuevo({
      id: 0,
      nombre: "",
      descripcion: "",
      calorias: "",
      imagen: "",
      ingredientes: "",
      planNutricional: {
        idPlanNutrcional: 1,
        nombre: "",
        descripcion: "",
        duracionSemanal: 1,
        caloriasObjetivo: 1,
      },
    });
    setImagenFile(null);
    setModoEdicion(false);
    setOpen(true);
  };

  const subirImagen = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("archivo", file);
    const response = await api.post("/api/imagen-plato", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.url;
  };

  const handleGuardar = async () => {
    try {
      let urlImagen = nuevo.imagen;
      if (imagenFile) {
        urlImagen = await subirImagen(imagenFile);
      }

      const data = {
        nombre: nuevo.nombre,
        descripcion: nuevo.descripcion,
        calorias: parseInt(nuevo.calorias),
        ingredientes: nuevo.ingredientes,
        imagen: urlImagen,
        planNutricional: { ...nuevo.planNutricional },
      };

      if (modoEdicion && platoIdEditar != null) {
        await PlatosService.update(platoIdEditar, data);
        showSuccess("Plato actualizado correctamente");
      } else {
        await PlatosService.create(data);
        showSuccess("Plato guardado correctamente");
      }

      setOpen(false);
      cargarPlatos();
    } catch (error) {
      showError("Error al guardar plato");
      console.error(error);
    }
  };

  const handleEditar = (item: any) => {
    setModoEdicion(true);
    setPlatoIdEditar(item.idPlatoSugerido || item.id); // adaptá según tu backend
    setNuevo({
      ...item,
      calorias: item.calorias.toString(),
    });
    setOpen(true);
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Estás seguro que deseas eliminar este plato?")) return;

    try {
      await PlatosService.delete(id);
      showSuccess("Plato eliminado correctamente");
      cargarPlatos();
    } catch (error) {
      showError("Error al eliminar plato");
      console.error(error);
    }
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Gestión de Platos</Typography>
      <Button variant="contained" color="warning" onClick={handleOpen}>
        Nuevo Plato
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Calorías</TableCell>
              <TableCell>Ingredientes</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>{item.descripcion}</TableCell>
                <TableCell>{item.calorias}</TableCell>
                <TableCell>{item.ingredientes}</TableCell>
                <TableCell>
                  {item.imagen && (
                    <img src={item.imagen} alt={item.nombre} width="50" height="50" style={{ objectFit: "cover" }} />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditar(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleEliminar(item.idPlatoSugerido || item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{modoEdicion ? "Editar Plato" : "Nuevo Plato"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Nombre" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
          <TextField fullWidth margin="dense" label="Descripción" value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} />
          <TextField fullWidth margin="dense" label="Calorías" type="number" value={nuevo.calorias} onChange={(e) => setNuevo({ ...nuevo, calorias: e.target.value })} />
          <TextField fullWidth margin="dense" label="Ingredientes" value={nuevo.ingredientes} onChange={(e) => setNuevo({ ...nuevo, ingredientes: e.target.value })} />

          <Typography variant="subtitle1" mt={2}>Plan Nutricional</Typography>
          <TextField fullWidth margin="dense" label="Nombre del plan" value={nuevo.planNutricional.nombre} onChange={(e) =>
            setNuevo({ ...nuevo, planNutricional: { ...nuevo.planNutricional, nombre: e.target.value } })
          } />
          <TextField fullWidth margin="dense" label="Descripción del plan" value={nuevo.planNutricional.descripcion} onChange={(e) =>
            setNuevo({ ...nuevo, planNutricional: { ...nuevo.planNutricional, descripcion: e.target.value } })
          } />
          <TextField fullWidth margin="dense" label="Duración semanal" type="number" value={nuevo.planNutricional.duracionSemanal} onChange={(e) =>
            setNuevo({ ...nuevo, planNutricional: { ...nuevo.planNutricional, duracionSemanal: parseInt(e.target.value) } })
          } />
          <TextField fullWidth margin="dense" label="Calorías objetivo" type="number" value={nuevo.planNutricional.caloriasObjetivo} onChange={(e) =>
            setNuevo({ ...nuevo, planNutricional: { ...nuevo.planNutricional, caloriasObjetivo: parseInt(e.target.value) } })
          } />

          <Box mt={2}>
            <input type="file" accept="image/*" onChange={handleImagenChange} />
            {imagenFile && (
              <Box mt={1}>
                <Typography variant="body2">Vista previa:</Typography>
                <img src={URL.createObjectURL(imagenFile)} alt="Vista previa" width="100" height="100" style={{ objectFit: "cover" }} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>
            {modoEdicion ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Platos;
