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
  IconButton
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EjerciciosService from "../../services/EjerciciosService";
import { showError, showSuccess } from "../../utils/alerts";

interface Ejercicio {
  id: number;
  nombre: string;
  explicacion: string;
  urlVideo: string;
  imagen?: string;
}

const Ejercicios = () => {
  const [items, setItems] = useState<Ejercicio[]>([]);
  const [open, setOpen] = useState(false);
  const [detalle, setDetalle] = useState<Ejercicio | null>(null);
  const [actual, setActual] = useState<Ejercicio>({
    id: 0,
    nombre: '',
    explicacion: '',
    urlVideo: '',
    imagen: ''
  });

  useEffect(() => {
    EjerciciosService.getAll()
      .then(r => setItems(r.data))
      .catch(() => {});
  }, []);

  const handleGuardar = async () => {
    try {
      if (actual.id) {
        await EjerciciosService.update(actual.id, actual);
        setItems(items.map(i => (i.id === actual.id ? actual : i)));
      } else {
        const response = await EjerciciosService.create(actual);
        const nuevo = response.data || { ...actual, id: items.length + 1 };
        setItems([...items, nuevo]);
      }
      showSuccess('Ejercicio guardado');
    } catch (e) {
      showError('Error al guardar ejercicio');
    } finally {
      setOpen(false);
      setActual({ id: 0, nombre: '', explicacion: '', urlVideo: '', imagen: '' });
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      await EjerciciosService.delete(id);
      setItems(items.filter(i => i.id !== id));
      showSuccess('Ejercicio eliminado');
    } catch {
      showError('Error al eliminar ejercicio');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Gestión de Ejercicios</Typography>
      <Button variant="contained" color="warning" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
        Nuevo Ejercicio
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>
                  <IconButton color="info" onClick={() => setDetalle(item)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="primary" onClick={() => { setActual(item); setOpen(true); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleEliminar(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{actual.id ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Nombre" value={actual.nombre} onChange={e => setActual({ ...actual, nombre: e.target.value })} />
          <TextField fullWidth margin="dense" label="Explicación" value={actual.explicacion} onChange={e => setActual({ ...actual, explicacion: e.target.value })} />
          <TextField fullWidth margin="dense" label="URL Video" value={actual.urlVideo} onChange={e => setActual({ ...actual, urlVideo: e.target.value })} />
          <TextField fullWidth margin="dense" label="Imagen" value={actual.imagen} onChange={e => setActual({ ...actual, imagen: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(detalle)} onClose={() => setDetalle(null)}>
        <DialogTitle>{detalle?.nombre}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>{detalle?.explicacion}</Typography>
          {detalle?.urlVideo && (
            <Typography gutterBottom>Video: <a href={detalle.urlVideo} target="_blank" rel="noreferrer">{detalle.urlVideo}</a></Typography>
          )}
          {detalle?.imagen && (
            <Box component="img" src={detalle.imagen} alt={detalle.nombre} sx={{ width: '100%', mt: 1 }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalle(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Ejercicios;
