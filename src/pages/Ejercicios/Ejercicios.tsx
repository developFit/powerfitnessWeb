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
  idEjercicio: number;
  nombre: string;
  explicacion: string;
  urlVideo: string;
  imagenUrl?: string;
  imagen?: File
}

const Ejercicios = () => {
  const [items, setItems] = useState<Ejercicio[]>([]);
  const [open, setOpen] = useState(false);
  const [detalle, setDetalle] = useState<Ejercicio | null>(null);
  const [actual, setActual] = useState<Ejercicio>({
    idEjercicio: 0,
    nombre: '',
    explicacion: '',
    urlVideo: '',
    imagenUrl: '',
  });
  const [imagenFile, setImagenFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    EjerciciosService.getAll()
      .then(r => setItems(r.data))
      .catch(() => {});
  }, []);

  const handleGuardar = async () => {
    try {
      if (actual.idEjercicio) {
        await EjerciciosService.update(actual.idEjercicio, actual);
        setItems(items.map(i => (i.idEjercicio === actual.idEjercicio ? actual : i)));
      } else {
        
        const ejercicioNuevoConImagen = {
          nombre: actual.nombre,
          explicacion: actual.explicacion,
          urlVideo: actual.urlVideo,
          imagen: imagenFile
        }
        
        const response = await EjerciciosService.createWithImage(ejercicioNuevoConImagen);
        const nuevo = response.data || { ...actual, idEjercicio: items.length + 1 };
        setItems([...items, nuevo]);
      }
      showSuccess('Ejercicio guardado');
    } catch (e) {
      showError('Error al guardar ejercicio');
    } finally {
      setOpen(false);
      setActual({ idEjercicio: 0, nombre: '', explicacion: '', urlVideo: '', imagenUrl: '' });
    }
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
    }
  };

  const handleEliminar = async (idEjercicio: number) => {
    try {
      await EjerciciosService.delete(idEjercicio);
      setItems(items.filter(i => i.idEjercicio !== idEjercicio));
      showSuccess('Ejercicio eliminado');
    } catch {
      showError('Error al eliminar ejercicio');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Gestión de Ejercicios</Typography>
      <div style={{
        display: "flex",
        justifyContent: "end"
      }}>
        <Button variant="contained" color="warning" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Nuevo Ejercicio
        </Button>
      </div>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ejercicio</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.idEjercicio}>
                <TableCell>{item.idEjercicio}</TableCell>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>
                  <img src={item.imagenUrl} alt="" width={200} height={200} style={{objectFit: "contain"}}/>
                </TableCell>
                <TableCell>
                  <IconButton color="info" onClick={() => setDetalle(item)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="primary" onClick={() => { setActual(item); setOpen(true); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleEliminar(item.idEjercicio)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{actual.idEjercicio ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Nombre" value={actual.nombre} onChange={e => setActual({ ...actual, nombre: e.target.value })} />
          <TextField fullWidth margin="dense" label="Explicación" value={actual.explicacion} onChange={e => setActual({ ...actual, explicacion: e.target.value })} />
          <TextField fullWidth margin="dense" label="URL Video" value={actual.urlVideo} onChange={e => setActual({ ...actual, urlVideo: e.target.value })} />
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

      <Dialog open={Boolean(detalle)} onClose={() => setDetalle(null)}>
        <DialogTitle>{detalle?.nombre}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>{detalle?.explicacion}</Typography>
          {detalle?.urlVideo && (
            <Typography gutterBottom>Video: <a href={detalle.urlVideo} target="_blank" rel="noreferrer">{detalle.urlVideo}</a></Typography>
          )}
          {detalle?.imagen && (
            <Box component="img" src={detalle.imagenUrl} alt={detalle.nombre} sx={{ width: '100%', mt: 1 }} />
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
