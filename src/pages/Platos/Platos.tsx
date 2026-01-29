import React, { useEffect, useRef, useState } from "react";
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

interface Item {
  idPlatoSugerido: number;
  nombre: string;
  descripcion: string;
  calorias: string;
  urlImagen?: string;
  ingredientes: string;
  estadoPlato: string;
}

const Platos = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [nuevo, setNuevo] = useState<Item>({ idPlatoSugerido: 0, nombre: "", descripcion: "", calorias: "", urlImagen: "", ingredientes: "", estadoPlato: "" });
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [detalleOpen, setDetalleOpen] = useState<boolean>(false)
  const [platoSeleccionado, setPlatoSeleccionado] = useState<Item>();

  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [itemsEliminacionMasiva, setItemsEliminacionMasiva] = useState<Item[]>([]);

  
  useEffect(() => {
    PlatosService.getAll().then((resp) =>{
      setItems(resp.filter((p:Item) => p.estadoPlato == "ACTIVO"))
    })
  },[])


  const handleOpen = () => {
    setNuevo({ idPlatoSugerido: 0, nombre: "", descripcion: "", calorias: "", urlImagen: "", ingredientes: "", estadoPlato: ""});
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

  const handleGuardarEdicion = async () => {
    PlatosService.update(platoSeleccionado, imagenFile).then((resp) => {
      showSuccess(resp);
      setEditOpen(false);
      setPlatoSeleccionado(undefined);
      PlatosService.getAll().then((resp) =>{
        setItems(resp.filter((p:Item) => p.estadoPlato == "ACTIVO"))
      })
    })
  }

  function handleVerDetalle(item: Item): void {
    setDetalleOpen(true);
    setPlatoSeleccionado(item);
  }

  function handleEditar(item: Item): void {
    setEditOpen(true);
    if(platoSeleccionado?.idPlatoSugerido == item.idPlatoSugerido){
      return;
    }
    else{
      setPlatoSeleccionado(item);
    }
  }

  function handleEliminar(item: Item): void {
    PlatosService.delete(item.idPlatoSugerido).then((resp: string) => {
        showSuccess(resp);
        PlatosService.getAll().then((resp) =>{
        setItems(resp.filter((p:Item) => p.estadoPlato == "ACTIVO"))
      })
    })
  }

  const handleEliminarPlatos = () => {
    itemsEliminacionMasiva.forEach(plato => {
      handleEliminar(plato);
    })
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Gestión de Platos</Typography>
      <div style={{
        display: "flex",
        justifyContent: "end"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "5px"
        }}>
          {itemsEliminacionMasiva.length > 0 ? 
            <Button variant="contained" color="warning" onClick={handleEliminarPlatos}>
              <DeleteIcon></DeleteIcon> Eliminar platos
            </Button>
            : ""
          }
          <Button variant="contained" color="warning" onClick={handleOpen}>
            <AddIcon></AddIcon> Nuevo Plato
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
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
                <TableCell><input type="checkbox" style={{cursor: "pointer"}} onChange={(e) => {
                  if(e.target.checked){
                    setItemsEliminacionMasiva([...itemsEliminacionMasiva, item])
                  }
                  else{
                    setItemsEliminacionMasiva(itemsEliminacionMasiva.filter(plato => plato.idPlatoSugerido != item.idPlatoSugerido))
                  }
                }}/></TableCell>
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
            <input type="file" accept="image/*" onChange={handleImagenChange} ref={fileInputRef}/>
            {imagenFile && (
              <Box mt={1}>
                <Typography variant="body2">Vista previa: (Para eliminar la foto dale click)</Typography>
                <img src={URL.createObjectURL(imagenFile)} onClick={() => {
                   setImagenFile(null);
                   if(fileInputRef.current){
                    fileInputRef.current.value = ""
                   }

                }} alt="Vista previa" width="100" height="100" style={{ objectFit: "cover" }} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={detalleOpen} onClose={() => setDetalleOpen(false)}>
        <DialogActions>
          <CloseIcon onClick={() => setDetalleOpen(false)}></CloseIcon>
        </DialogActions>
        <DialogTitle>
            <strong>Plato: </strong>{platoSeleccionado?.nombre}
        </DialogTitle>
        <DialogContent>
            <p><strong>Calorias: </strong>{platoSeleccionado?.calorias}</p>
            <p><strong>Ingredientes: </strong>{platoSeleccionado?.ingredientes}</p>
            <p><strong>Descripcion: </strong>{platoSeleccionado?.descripcion}</p>
            <img src={platoSeleccionado?.urlImagen} alt={"Imagen del plato " + platoSeleccionado?.nombre} width={200} height={200} style={{objectFit: "contain"}}/>
        </DialogContent>
      </Dialog>
      
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle style={{textAlign: "center"}}>
            <strong>Edicion de plato</strong>
        </DialogTitle>
        <DialogContent sx={{
          display: "flex",
          flexDirection: "column",
          gap: "5px"
        }}>
            <div>
              <strong>Nombre: </strong>
              <TextField
                fullWidth
                margin="dense"
                value={platoSeleccionado?.nombre}
                onChange={e => {
                  if(platoSeleccionado){
                    setPlatoSeleccionado({ ...platoSeleccionado, nombre: e.target.value })
                  }
                }}
              />
            </div>
            <div>
              <strong>Calorias: </strong>
              <TextField
                fullWidth
                margin="dense"
                value={platoSeleccionado?.calorias}
                onChange={e => {
                  if(platoSeleccionado){
                    setPlatoSeleccionado({ ...platoSeleccionado, calorias: e.target.value })
                  }
                }}
              />
            </div>
            <div>
              <strong>Ingredientes: </strong>
              <TextField
                fullWidth
                margin="dense"
                value={platoSeleccionado?.ingredientes}
                onChange={e => {
                  if(platoSeleccionado){
                    setPlatoSeleccionado({ ...platoSeleccionado, ingredientes: e.target.value })
                  }
                }}
              />
            </div>
            <div>
              <strong>Descripcion: </strong>
              <TextField
                fullWidth
                margin="dense"
                value={platoSeleccionado?.descripcion}
                onChange={e => {
                  if(platoSeleccionado){
                    setPlatoSeleccionado({ ...platoSeleccionado, descripcion: e.target.value })
                  }
                }}
              />
            </div>
            <div style={{textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center"}}>
              <strong>Imagen del plato: </strong>
              <img src={
                imagenFile 
                ? URL.createObjectURL(imagenFile)
                : platoSeleccionado?.urlImagen
              } alt={"Imagen del plato " + platoSeleccionado?.nombre} width={200} height={200} style={{objectFit: "contain"}}/>
              <input type="file" accept="image/*" onChange={handleImagenChange} ref={fileInputRef}/> 
            </div>
            
        </DialogContent>
        <DialogActions>
              <Button onClick={() => {
                setImagenFile(null);
                setEditOpen(false);
                setPlatoSeleccionado(undefined);
              }}>Cancelar</Button>
              <Button variant="contained" onClick={handleGuardarEdicion}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Platos;
