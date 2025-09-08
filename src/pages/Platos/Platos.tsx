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
import api from "../../services/api";
import { showError, showSuccess } from "../../utils/alerts";
import PlatosService from "../../services/PlatosService";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Item {
  idPlatoSugerido: number;
  nombre: string;
  descripcion: string;
  calorias: string;
  urlImagen?: string;
  ingredientes: string
}

const Platos = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [nuevo, setNuevo] = useState<Item>({ idPlatoSugerido: 0, nombre: "", descripcion: "", calorias: "", urlImagen: "", ingredientes: "" });
  const [imagenFile, setImagenFile] = useState<File | null>(null);

  useEffect(() => {
    PlatosService.getAll().then((resp) =>{
      setItems(resp)
    })
  },[])


  const handleOpen = () => {
    setNuevo({ idPlatoSugerido: 0, nombre: "", descripcion: "", calorias: "", urlImagen: "", ingredientes: ""});
    setImagenFile(null);
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

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
    }
  };

  const handleGuardar = async () => {
    try {
      if (imagenFile) {
        //urlImagen = await subirImagen(imagenFile);
      }

      const nuevoPlato = { ...nuevo, imagen: imagenFile, idPlatoSugerido: items.length + 1 };
      //setItems([...items, nuevoPlato]);
      PlatosService.create(nuevoPlato)

      setOpen(false);
      showSuccess("Plato guardado correctamente");
    } catch (error) {
      showError("Error al subir imagen o guardar plato");
      console.error(error);
    }
  };

  function handleVerDetalle(item: Item): void {
    throw new Error("Function not implemented.");
  }

  function handleEditar(item: Item): void {
    throw new Error("Function not implemented.");
  }

  function handleEliminar(item: Item): void {
    throw new Error("Function not implemented.");
  }

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
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Calorías</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.idPlatoSugerido}>
                <TableCell>{item.idPlatoSugerido}</TableCell>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>{item.descripcion}</TableCell>
                <TableCell>{item.calorias}</TableCell>
                <TableCell>
                  {item.urlImagen && (
                    <img src={item.urlImagen} alt={item.nombre} width="50" height="50" style={{ objectFit: "cover" }} />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton color="info" onClick={() => handleVerDetalle(item)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handleEditar(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleEliminar(item)}>
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
          if (r === "backdropClick" || r === "escapeKeyDown") return;
          setOpen(false);
        }}
      >
        <DialogTitle>Nuevo Plato</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Nombre" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
          <TextField fullWidth margin="dense" label="Descripción" value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} />
          <TextField fullWidth margin="dense" label="Calorías" value={nuevo.calorias} onChange={(e) => setNuevo({ ...nuevo, calorias: e.target.value })} />
          <TextField fullWidth margin="dense" label="Ingredientes" value={nuevo.ingredientes} onChange={(e) => setNuevo({ ...nuevo, ingredientes: e.target.value })} />
          
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
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Platos;
