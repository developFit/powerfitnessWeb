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
  imagen?: File,
  estadoEjercicio: string;
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
    estadoEjercicio: ''
  });
  const [ejercicioAEditar, setEjercicioAEditar] = useState<Ejercicio>();

  const [imagenFile, setImagenFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    EjerciciosService.getAll()
      .then(r => setItems(r.filter((e:Ejercicio) => e.estadoEjercicio == "ACTIVO")))
      .catch(() => {});
  }, []);

  const handleGuardar = async () => {
    try {
      if (ejercicioAEditar?.idEjercicio) {
        await EjerciciosService.update(ejercicioAEditar?.idEjercicio, ejercicioAEditar, imagenFile).then((resp) => {
          showSuccess(resp);
          setEjercicioAEditar(undefined)
          EjerciciosService.getAll()
          .then(r => {
            EjerciciosService.getAll()
              .then(r => setItems(r.filter((e:Ejercicio) => e.estadoEjercicio == "ACTIVO")))
              .catch(() => {});
          })
          .catch(() => {
            setImagenFile(undefined);
          });
        });
        
      } else {
        
        const ejercicioNuevoConImagen = {
          nombre: actual.nombre,
          explicacion: actual.explicacion,
          urlVideo: actual.urlVideo,
          imagen: imagenFile
        }

        console.log(actual)
        
        const response = await EjerciciosService.createWithImage(ejercicioNuevoConImagen).then(() =>{
          EjerciciosService.getAll()
              .then(r => setItems(r.filter((e:Ejercicio) => e.estadoEjercicio == "ACTIVO")))
              .catch(() => {
                
              });
          }).catch(()=>{
                setImagenFile(undefined);
          });
        
      }
      showSuccess('Ejercicio guardado');
    } catch (e) {
      showError('Error al guardar ejercicio');
    } finally {
      setOpen(false);
      setActual({ idEjercicio: 0, nombre: '', explicacion: '', urlVideo: '', imagenUrl: '', estadoEjercicio: ''});
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
      await EjerciciosService.delete(idEjercicio).then((resp) => {
        showSuccess(resp);
        EjerciciosService.getAll()
        .then(r => setItems(r.filter((e:Ejercicio) => e.estadoEjercicio == "ACTIVO")))
        .catch(() => {});
      });
      
    } catch {
      showError('Error al eliminar ejercicio');
    }
  };

  const editarOCrearNombre = (valor: string) => {
    if (ejercicioAEditar) {
      setEjercicioAEditar({ ...ejercicioAEditar, nombre: valor })
    }
    else{
      setActual({ ...actual, nombre: valor});
    }
  }

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
                  <IconButton color="primary" onClick={() => {setEjercicioAEditar(item); setOpen(true); }}>
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
        <DialogTitle>{ejercicioAEditar?.idEjercicio ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Nombre" value={ejercicioAEditar?.nombre} onChange={(e) => {editarOCrearNombre(e.target.value)}} />
          <TextField fullWidth margin="dense" label="Explicación" value={ejercicioAEditar?.explicacion} onChange={e => {
            if (ejercicioAEditar) {
              setEjercicioAEditar({ ...ejercicioAEditar, explicacion: e.target.value })
            }
            else{
              setActual({ ...actual, explicacion: e.target.value });
            }
          }} />
          <TextField fullWidth margin="dense" label="URL Video" value={ejercicioAEditar?.urlVideo} onChange={e => {
            if (ejercicioAEditar) {
              setEjercicioAEditar({ ...ejercicioAEditar, urlVideo: e.target.value })
            }
            else{
              setActual({ ...actual, urlVideo: e.target.value });
            }
          }} />
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
          <Typography gutterBottom><strong>Detalle: </strong>{detalle?.explicacion}</Typography>
          {detalle?.urlVideo && (
            <Typography gutterBottom><strong>Video: </strong> <a href={detalle.urlVideo} target="_blank" rel="noreferrer">{detalle.urlVideo}</a></Typography>
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
