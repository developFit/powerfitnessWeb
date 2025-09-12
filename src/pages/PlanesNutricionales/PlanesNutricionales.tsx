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
  MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { showError, showSuccess } from "../../utils/alerts";
import PlanesNutricionalesService from "../../services/PlanesNutricionalesService";
import PlatosService from "../../services/PlatosService";

interface Plato {
  idPlatoSugerido: number;
  nombre: string;
  descripcion: string;
  calorias: number;
  ingredientes: string;
}

interface Plan {
  idPlanNutrcional: number;
  nombre: string;
  desayuno: string;
  almuerzo: string;
  cena: string;
  colaciones: string[];
  platos: Item[];
  nombreRutina: string;
  tips: string;
}


const emptyPlan: Plan = {
  idPlanNutrcional: 0,
  nombre: "",
  desayuno: "",
  almuerzo: "",
  cena: "",
  colaciones: [""],
  platos: [],
  nombreRutina: "",
  tips: ""
};

interface PlanDisponible {
  idPlan?: number;           // Para rutinas disponibles
  idPlanNutrcional?: number; // Para el plan asignado (con typo de la API)
  nombre: string;
}

interface Item {
  idPlatoSugerido: number;
  nombre: string;
  descripcion: string;
  calorias: string;
  urlImagen?: string;
  ingredientes: string
}

interface ItemNuevo {
  nombre: string;
  descripcion: string;
  calorias: string;
  ingredientes: string,
}

const PlanesNutricionales = () => {
  const [items, setItems] = useState<Plan[]>([]);
  const [open, setOpen] = useState(false);
  const [nuevo, setNuevo] = useState<Plan>(emptyPlan);
  const [platos, setPlatos] = useState<Item[]>([]);
  const [platosExistentes, setPlatosExistentes] = useState<Item[]>([]);
  const [detalle, setDetalle] = useState<Plan | null>(null);

  useEffect(() => {
    PlatosService.getAll().then((resp) =>{
      setPlatosExistentes(resp);
    });

    PlanesNutricionalesService.getAll().then((resp) => {
      setItems(resp);
    })
  },[])

  const handleOpen = () => {
    setNuevo(emptyPlan);
    setOpen(true);
  };

  const handleAddColacion = () => {
    setNuevo((prev) => ({ ...prev, colaciones: [...prev.colaciones, ""] }));
  };

  const handleGuardar = () => {
    try {
      
      const nuevoPlan = { ...nuevo, id: items.length + 1 , platos: platos};
      PlanesNutricionalesService.create(nuevoPlan).then((resp) => {
        setItems([...items, nuevoPlan]);
        setOpen(false);
        showSuccess(resp);
      })
      
      console.log(platos)
      
    } catch (error) {
      showError("Error al guardar plan");
    }
  };

  const handleVerDetalle = (item: Plan) => {
    setDetalle(item);
  };

  const handleSeleccionarPlatoExistente = (platoExistenteSeleccionado: string) => {
    try{
      const platoSelect = JSON.parse(platoExistenteSeleccionado)
      const resultado = platos.find((p) => p.idPlatoSugerido == Number(platoSelect.idPlatoSugerido) || p.nombre == platoSelect.nombre)
      if(!resultado){

        const platoEncontrado = platosExistentes.find(p => p.idPlatoSugerido == Number(platoSelect.idPlatoSugerido));

        if(platoEncontrado){
          setPlatos([...platos, platoEncontrado]);
        }
      }else{
        showError("Ya hay un plato con ese nombre en la lista")
      }
    }
    catch (error) {
      showError("Algo salio mal")
    }
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Gestión de Planes Nutricionales
      </Typography>
      <div style={{display: "flex", justifyContent: "end"}}>
        <Button variant="contained" color="warning" onClick={handleOpen}>
          <AddIcon></AddIcon> Nuevo Plan Nutricional
        </Button>
      </div>
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
            {items.map((plan) => (
              <TableRow key={plan.idPlanNutrcional}>
                <TableCell>{plan.idPlanNutrcional}</TableCell>
                <TableCell>{plan.nombreRutina}</TableCell>
                <TableCell>
                  <IconButton color="info" onClick={() => handleVerDetalle(plan)}>
                    <VisibilityIcon/>
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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Nuevo Plan Nutricional</DialogTitle>
        <DialogContent>

          <TextField
            fullWidth
            margin="dense"
            label="Nombre"
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
        
          
              <TextField
                select
                label="Platos sugeridos"
                fullWidth
                margin="dense"
                SelectProps={{ multiple: false }}
                value={platosExistentes}
                onChange={(e) =>
                  {
                    if (e.target.value) {
                      handleSeleccionarPlatoExistente(e.target.value)
                    };
                  }
                }
              >
                <MenuItem>
                  <em>Seleccione los platos que quiere agregar</em>
                </MenuItem>
                {platosExistentes
                    .filter(p => p && p.idPlatoSugerido !== undefined && p.idPlatoSugerido !== null && p.nombre)
                    .map(p => (
                      <MenuItem key={p.idPlatoSugerido} value={JSON.stringify(p)} style={{display: "flex", justifyContent: "space-between"}}>
                        {p.nombre} <img src={p.urlImagen} alt="" width={100} height={100}/>
                      </MenuItem>
                    ))
                  }
              </TextField>
          <div  style={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                borderRadius: "8px",
                backgroundColor: "#f5f5f5"
              }}>
            {platos
            .map(p => (
              <Button key={p.idPlatoSugerido}
              sx={{
                display:"flex",
                alignItems: "center",
                padding: "10px",
                borderRadius: "10px",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#ed6c02",
                  cursor: "pointer",
                  color: "white"
                }
              }}
              onClick={(e) => {
                setPlatos(platos.filter((plato) => plato.idPlatoSugerido != p.idPlatoSugerido))
              }}>
                <CloseIcon></CloseIcon>
                {p.nombre}
                <img src={p.urlImagen}  alt="Imagen del plato" width="100" height="100" style={{ objectFit: "contain", borderRadius: "10px", }} />
              </Button>
              
            ))
          }
          </div>
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

      <Dialog
              open={!!detalle}
              onClose={(e, r) => {
                if (r === 'backdropClick' || r === 'escapeKeyDown') return;
                setDetalle(null);
              }}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle style={{backgroundColor: "#ed6c02", color: "white"}}>
                Detalle de {detalle?.nombreRutina}
              </DialogTitle>
              <DialogContent dividers>
                {detalle && (
                  <Box>
                    <Typography><strong>Nombre:</strong> {detalle.nombreRutina}</Typography>
                    <Typography><strong>Platos:</strong> {detalle?.platos?.length || 0}</Typography>
                    {detalle?.platos?.map((d, i) => (
                      <div style={{display: "flex", justifyContent: "space-between", alignContent: "center"}}>
                        <Box key={i} sx={{ mt: 2 }}>
                          <Typography variant="subtitle1"><strong>{d.nombre}</strong></Typography>
                          <Typography variant="subtitle2" style={{textDecoration: "underline"}}>Ingredientes:</Typography>
                          <ul>
                            <li>{d.ingredientes}</li>
                          </ul>
                        </Box>
                        <img src={d.urlImagen} alt="" width={100} height={100}/>
                      </div>
                    ))}
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetalle(null)}>Cerrar</Button>
              </DialogActions>
            </Dialog>
    </Box>
  );
};

export default PlanesNutricionales;

