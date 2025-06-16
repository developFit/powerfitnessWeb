import React, { useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from "@mui/material";
import axios from "axios";

interface Item {
  id: number;
  nombre: string;
  descripcion: string;
  calorias: string;
  imagen?: string;
}

const Platos = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [nuevo, setNuevo] = useState<Item>({ id: 0, nombre: "", descripcion: "", calorias: "", imagen: "" });
  const [imagenFile, setImagenFile] = useState<File | null>(null);

  const handleOpen = () => {
    setNuevo({ id: 0, nombre: "", descripcion: "", calorias: "", imagen: "" });
    setImagenFile(null);
    setOpen(true);
  };

  const subirImagen = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("archivo", file);

    const response = await axios.post("http://localhost:8080/api/imagen-plato", formData, {
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
      let urlImagen = nuevo.imagen;
      if (imagenFile) {
        urlImagen = await subirImagen(imagenFile);
      }

      const nuevoPlato = { ...nuevo, imagen: urlImagen, id: items.length + 1 };
      setItems([...items, nuevoPlato]);
      setOpen(false);
    } catch (error) {
      alert("Error al subir imagen o guardar plato");
      console.error(error);
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
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Calorías</TableCell>
              <TableCell>Imagen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>{item.descripcion}</TableCell>
                <TableCell>{item.calorias}</TableCell>
                <TableCell>
                  {item.imagen && (
                    <img src={item.imagen} alt={item.nombre} width="50" height="50" style={{ objectFit: "cover" }} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nuevo Plato</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Nombre" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
          <TextField fullWidth margin="dense" label="Descripción" value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} />
          <TextField fullWidth margin="dense" label="Calorías" value={nuevo.calorias} onChange={(e) => setNuevo({ ...nuevo, calorias: e.target.value })} />
          
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
