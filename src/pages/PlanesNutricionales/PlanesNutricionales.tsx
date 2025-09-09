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
  const [valorPlato, setValorPlato] = useState("");
  const [platos, setPlatos] = useState<Item[]>([]);
  const [platosExistentes, setPlatosExistentes] = useState<Item[]>([]);
  const [platosNuevos, setPlatosNuevos] = useState<any[]>([])
  const [nuevoPlato, setNuevoPlato] = useState<ItemNuevo>({nombre: "", descripcion: "", calorias: "", ingredientes: "" });
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  
  useEffect(() => {
    PlatosService.getAll().then((resp) =>{
      setPlatosExistentes(resp);
    })
  },[])

  const handleGuardarPlatosNuevos = (plato: any) => {
    if(imagenFile == null){
        showError("Debe agregar una imagen");
        return;
    }
    if(plato && plato.nombre != ""){
      const resultado = platosNuevos.find((p) => p.nombre.toLowerCase() == plato.nombre.toLowerCase());
      const resultadoPlatosExistentes = platosExistentes.find((p) => p.nombre.toLowerCase() == plato.nombre.toLowerCase())
      if (!resultado && !resultadoPlatosExistentes) {
        const nuevoPlatoParaLista = {...nuevoPlato, imagen: imagenFile}
        setPlatosNuevos([...platosNuevos.filter((p) => p.nombre != ""), nuevoPlatoParaLista])
        setNuevoPlato({nombre: "", descripcion: "", calorias: "", ingredientes: "" });
        setImagenFile(null);
      }
      else{
        showError("Ya existe ese plato, intenta agregarlo como existente")
      }
    }
  }

  const handleOpen = () => {
    setNuevo(emptyPlan);
    setOpen(true);
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setImagenFile(file);
      }
  };

  const handleAddColacion = () => {
    setNuevo((prev) => ({ ...prev, colaciones: [...prev.colaciones, ""] }));
  };

  const handleAddPlatoExistente = () => {
      setValorPlato("platoExistente");
      setNuevo(emptyPlan);
  }

  const handleAddPlato = () => {
    setValorPlato("nuevoPlato");
  };

  const crearPlatos = async () => {
    if(platosNuevos.length > 0){
      platosNuevos.forEach(async (p) => {
        const exiteUnPlato = platosExistentes.find( pe => p.nombre.toLowerCase() == pe.nombre.toLowerCase())
        console.log("Plato: ", exiteUnPlato, p)
        if(!exiteUnPlato){
          await PlatosService.create(p)
        }
      });
    }
  }

  const handleGuardar = () => {
    try {
      if(false){
        const nuevoPlan = { ...nuevo, id: items.length + 1 };
        PlanesNutricionalesService.create(nuevoPlan).then((resp) => {
          setItems([...items, nuevoPlan]);
          setOpen(false);
          showSuccess(resp);
        })
      }

      crearPlatos().then(() => {
        PlatosService.getAll().then((resp) => {
          setPlatosExistentes(resp);
        }).then(() => {
          setPlatos(platosExistentes.filter((elementoActual: Item) => platosNuevos.some((a) => elementoActual.nombre.toLowerCase() == a.nombre.toLowerCase()) || 
                                                    platos.some((b) => elementoActual.idPlatoSugerido == b.idPlatoSugerido)))
        })
      })

      
      console.log(platos)
      
    } catch (error) {
      showError("Error al guardar plan");
    }
  };

  const handleSeleccionarPlatoExistente = (platoExistenteSeleccionado: string) => {
    try{
      const platoSelect = JSON.parse(platoExistenteSeleccionado)
      const resultado = platos.find((p) => p.idPlatoSugerido == Number(platoSelect.idPlatoSugerido) || p.nombre == platoSelect.nombre)
      const resultadoEnListaNuevosPlatos = platosNuevos.find((p) => p.nombre == platoSelect.nombre)
      if(!resultado && !resultadoEnListaNuevosPlatos){

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
          
          <Button startIcon={<AddIcon />} onClick={handleAddPlato} sx={{ mt: 1, "&:hover": {
                  backgroundColor: "#ed6c02",
                  cursor: "pointer",
                  color: "white"
                } }}>
            Agregar Plato
          </Button>
          <Button sx={{
            "&:hover": {
                  backgroundColor: "#ed6c02",
                  cursor: "pointer",
                  color: "white"
                }
          }} startIcon={<AddIcon/>} onClick={handleAddPlatoExistente}> 
            Agregar plato existente
          </Button>
          {valorPlato == 'nuevoPlato' ? (
            <Box sx={{ border: "1px solid #ccc", p: 1, mt: 1 }}>
              <TextField
                  fullWidth
                  label="Nombre"
                  margin="dense"
                  value={nuevoPlato.nombre}
                  onChange={(e) => setNuevoPlato({ ...nuevoPlato, nombre: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Descripción"
                  margin="dense"
                  value={nuevoPlato.descripcion}
                  onChange={(e) => setNuevoPlato({ ...nuevoPlato, descripcion: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Calorías"
                  margin="dense"
                  type="number"
                  value={nuevoPlato.calorias}
                  onChange={(e) => setNuevoPlato({ ...nuevoPlato, calorias: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Ingredientes"
                  margin="dense"
                  value={nuevoPlato.ingredientes}
                  onChange={(e) => setNuevoPlato({ ...nuevoPlato, ingredientes: e.target.value })}
                />

                <Box mt={2}>
                  <input type="file" accept="image/*" onChange={handleImagenChange} />
                    {imagenFile && (
                      <Box mt={1}>
                        <Typography variant="body2">Vista previa:</Typography>
                        <img src={URL.createObjectURL(imagenFile)} alt="Vista previa" width="100" height="100" style={{ objectFit: "cover" }} />
                      </Box>
                    )}
                </Box>

                <div style={{display: "flex", justifyContent: "end"}}>
                  <IconButton
                    sx={{
                      "&:hover": {
                        backgroundColor: "green",
                        cursor: "pointer",
                        color: "white"
                      }
                    }}
                    aria-label="add"
                    onClick={() => handleGuardarPlatosNuevos(nuevoPlato)}
                  >
                    <AddIcon />
                  </IconButton>
                </div>
              </Box>
          )
            
            :
            (<div></div>)
          }
          {valorPlato == 'platoExistente' ? 
            (
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
            )
            
            :

            (<div></div>)
          }
          <div  style={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "4px 8px",
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

          {platosNuevos
            .map(p => (
              <Button key={p.nombre}
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
                setPlatosNuevos(prev => prev.filter((plato) => plato.nombre != p.nombre));
              }}>
                <CloseIcon></CloseIcon>
                {p.nombre}
                {p && p?.imagen && (
                    <img src={URL.createObjectURL(p?.imagen)}  alt="Imagen del plato" width="100" height="100" style={{ objectFit: "contain", borderRadius: "10px", }} />
                  ) 
                }
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
    </Box>
  );
};

export default PlanesNutricionales;

