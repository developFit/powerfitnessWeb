import React, { Key, useEffect, useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RutinasService from "../../services/RutinasService";
import AlumnosService from "../../services/AlumnosService";
import EjerciciosService from "../../services/EjerciciosService";
import { showError, showSuccess } from "../../utils/alerts";
import { toNumberOrZero } from "../../utils/number";
import CircularProgress from '@mui/material/CircularProgress';

interface Alumno {
  idAlumno: number;
  nombre: string;
}

interface EjercicioItem {
  idEjercicio: Key | null | undefined;
  id: number | string;
  nombre: string;
}

interface Ejercicio {
  idEjercicio: number;
  nombre: string;
  explicacion: string;
  urlVideo: string;
  imagenUrl?: string;
  imagen?: File,
  estadoEjercicio: string;
}

interface EjercicioRutina {
  idEjercicioDeRutina: number | string;
  grupoMuscular: string;
  rondas: string | undefined;
  repeticiones: string | undefined;
  carga: string;
  observaciones: string;
  ejercicio: EjercicioItem
}

interface DiaRutina {
  dia: string;
  ejerciciosDeRutinaResponseDTO: EjercicioRutina[];
}

interface Rutina {
  idRutina: number;
  nivelRutina: string;
  nombre: string;
  objetivo: string;
  diasPorSemana: string;
  tiempo: string;
  alumno: Alumno;
  jornadasResponseDTO: DiaRutina[];
  estadoRutina: string;
}

const diasSemana = [
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
  "DOMINGO",
];

const gruposMusculares = [
  "Pecho",
  "Espalda",
  "Piernas",
  "Hombros",
  "Bíceps",
  "Tríceps",
  "Abdominales",
];

const emptyAlumno: Alumno = {
  idAlumno: 0,
  nombre: ""
}

const emptyRutina: Rutina = {
  idRutina: 0,
  nombre: '',
  objetivo: '',
  diasPorSemana: '1',
  jornadasResponseDTO: [{ dia: 'LUNES', ejerciciosDeRutinaResponseDTO: [] }],
  nivelRutina: "",
  tiempo: "",
  alumno: emptyAlumno,
  estadoRutina: ""
};

const Rutinas = () => {
  const [items, setItems] = useState<Rutina[]>([]);
  const [itemsFiltrados, setItemsFiltrados] = useState<Rutina[]>([]);
  const [open, setOpen] = useState(false);
  const [detalle, setDetalle] = useState<Rutina | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [rutina, setRutina] = useState<Rutina>(emptyRutina);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno>();
  const [rutinasParaExportar, setRutinasParaExportar] = useState<Rutina[]>([])
  const [esExport, setEsExport] = useState<boolean>(false);
  const [esSeleccionMultiple, setEsSeleccionMultiple] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelectDisabled, setIsSelectDisabled] = useState<boolean>(false);

  useEffect(() => {
    cargarLoading()
    AlumnosService.getAll().then(r => setAlumnos(r.data));
    EjerciciosService.getAll().then(r => setEjercicios(r.filter((e:Ejercicio) => e.estadoEjercicio == "ACTIVO")));
    RutinasService.getAll()
      .then(r => {
        setItems(r)
        setItemsFiltrados(r.filter( (i: Rutina)=> i.estadoRutina == "ACTIVO"))
        frenarLoading()
      })
      .catch(() => {
        frenarLoading()
      });
  }, []);

  const handleAgregarDia = () => {
    setRutina(prev => ({
      ...prev,
      jornadasResponseDTO: [...prev.jornadasResponseDTO, { dia: 'LUNES', ejerciciosDeRutinaResponseDTO: [] }],
    }));
  };

  const handleEliminarDia = (indiceJornada: number) => {

    setRutina(prev => {
      const copy = { ...prev };
      copy.jornadasResponseDTO = [...prev.jornadasResponseDTO];
      copy.jornadasResponseDTO.splice(indiceJornada, 1)
      return copy
    });

  };

  const handleAgregarEjercicio = (i: number) => {
    setRutina(prev => {
      const copy = { ...prev };
      copy.jornadasResponseDTO = [...prev.jornadasResponseDTO];
      copy.jornadasResponseDTO[i] = { ...copy.jornadasResponseDTO[i] };
      copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO = [
        ...copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO,
        {
          idEjercicioDeRutina: 0,
          grupoMuscular: gruposMusculares[0],
          rondas: undefined,
          repeticiones: undefined,
          carga: '',
          observaciones: '',
          ejercicio: ejercicios[0]
        },
      ];
      return copy;
    });
  };

  const handleEliminarEjercicio = (i: number, j: number) => {
    setRutina(prev => {
      const copy = { ...prev };
      //console.log(copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO[j])
      copy.jornadasResponseDTO = [...prev.jornadasResponseDTO];
      copy.jornadasResponseDTO[i] = { ...copy.jornadasResponseDTO[i] };
      copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO.splice(j,1)
      return copy;
    });

  };


  const handleEditar = (index: number, r: any) => {
    //console.log(index)
    //console.log(r)
    setEditingIndex(index);
    const current = itemsFiltrados[index];
    //console.log("CURRENT", current)
    setRutina(current);
    setOpen(true);
  };

  const handleEliminar = async (rutinaAEliminar: any) => {
    try {
      cargarLoading()
      if (rutinaAEliminar && rutinaAEliminar.idRutina) {
        await RutinasService.delete(rutinaAEliminar.idRutina).then(() => {
          showSuccess('Rutina eliminada');
          RutinasService.getAll()
          .then(r =>{
            setItems(r)
            if(alumnoSeleccionado && alumnoSeleccionado.idAlumno > 0){
              setItemsFiltrados(r.filter( (i: Rutina)=> i.alumno.idAlumno == alumnoSeleccionado?.idAlumno && i.estadoRutina == "ACTIVO"))
            }
            else{
              setItemsFiltrados(r.filter( (i: Rutina)=> i.estadoRutina == "ACTIVO"))
            }
            frenarLoading()
          } )
          .catch(() => {
            frenarLoading()
          });
        });
      }
    } catch {
      showError('Error al eliminar rutina');
      frenarLoading()
    }
  };

  const handleVerDetalle = (item: Rutina) => {
    setDetalle(item);
  };

  const handleExport = () => {
    if(alumnoSeleccionado){
      setEsExport(false);
      const header = ['Alumno', 'Nombre', 'Objetivo', 'DiasPorSemana', "Estado de la rutina"];
      const rows = itemsFiltrados.map(r => [
        alumnos.find(a => a.idAlumno === r?.alumno?.idAlumno)?.nombre || r.idRutina,
        r.nombre,
        r.objetivo,
        r.diasPorSemana,
        r.estadoRutina
      ]);
      let csv = header.join(',') + '\n';
      csv += rows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rutinas.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    else{
      showError('Debe seleccionar el alumno del cual quiere exportar la rutina');
      setEsExport(false)
    }
  };

  const handleCrearRutina = () => {
    setOpen(true);
    if(alumnoSeleccionado){
      setRutina({...emptyRutina, alumno: alumnoSeleccionado})
    }
    else{
      setRutina(emptyRutina)
    }
  }

  const handleGuardar = async () => {
    setOpen(false);
    setItemsFiltrados([])
    cargarLoading()
    const payload = {
      idAlumno: rutina.alumno.idAlumno,
      nombre: rutina.nombre,
      objetivo: rutina.objetivo,
      diasPorSemana: rutina.diasPorSemana,
      dias: rutina.jornadasResponseDTO.map((j: any) =>{
        return {
          idJornada: j.idJornada,
          dia: j.dia,
          ejercicios: j.ejerciciosDeRutinaResponseDTO.map((ej: any) => {
            return {
              idEjercicio: ej.ejercicio.idEjercicio,
              grupoMuscular: ej.grupoMuscular,
              series: ej.rondas,
              repeticiones: ej.repeticiones,
              carga: ej.carga,
              observaciones: ej.observaciones
            }
          })
        }
      })
    }

    try {
      if (editingIndex !== null) {
        
        const current = itemsFiltrados[editingIndex] as any;
        
        if (current && current.idRutina) {
          await RutinasService.update(rutina.idRutina, payload).then(() => {
             RutinasService.getAll()
              .then(r =>{
                setItems(r)
                setItemsFiltrados(r.filter( (i: Rutina)=> i.estadoRutina == "ACTIVO"))
                frenarLoading();
              } )
              .catch(() => {
                frenarLoading();
              });
            showSuccess('Rutina actualizada');
          });
        }
        //const updated = current && current.id ? { ...payload, id: current.id } : payload;
        
      } else {
        const response = await RutinasService.create(payload);
        const nuevo = response.data || payload;
        RutinasService.getAll()
          .then(r =>{
            setItems(r);
            setItemsFiltrados(r.filter( (i: Rutina)=> i.estadoRutina == "ACTIVO"));
            frenarLoading();
          } )
          .catch(() => {
            frenarLoading();
          });
        showSuccess('Rutina guardada correctamente');
      }
    } catch (error) {
      showError('Error al guardar rutina');
      frenarLoading();
    } finally {
      setEditingIndex(null);
      setRutina(emptyRutina);
    }
  };

  const handleExportSeleccionMultiple = () => {
    setEsExport(false);
    const header = ['Alumno', 'Nombre', 'Objetivo', 'DiasPorSemana', "Estado de la rutina"];
    const rows = rutinasParaExportar.map(r => [
      r.alumno.nombre,
      r.nombre,
      r.objetivo,
      r.diasPorSemana,
      r.estadoRutina
    ]);
    let csv = header.join(',') + '\n';
    csv += rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rutinas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setEsSeleccionMultiple(false);
  }

  const cargarLoading = () => {
    setIsLoading(true)
    setIsSelectDisabled(true)
  }

  const frenarLoading = () => {
    setIsLoading(false)
    setIsSelectDisabled(false)
  }

  const filtrarPorAlumno = async (value: string) => {
    setItemsFiltrados(items.filter(i => i.alumno.idAlumno.toString() == value && i.estadoRutina == "ACTIVO"))
  }

  const handlerCargarRutinasDeAlumno = (value: string) => {
    filtrarPorAlumno(value).then(() => {
      const alumnoEncontrado = alumnos.find(a => a.idAlumno.toString() == value);
      setAlumnoSeleccionado(alumnoEncontrado);
    })
    
  }

  const ajustarParaSeleccionarVarios = () => {
    setEsExport(false);
    setEsSeleccionMultiple(true);
  }

  return (
    <Box>
      <Typography variant="h5">Rutinas</Typography>
      <Box display="flex" gap={1} justifyContent={"space-between"}>
        
            <Select
            disabled={isSelectDisabled}
            displayEmpty
            style={{width: "100%",  backgroundColor: "white", color: "black"}}
              value={alumnoSeleccionado?.idAlumno.toString() ?? ""}
              onChange={async (e) => {
                handlerCargarRutinasDeAlumno(e.target.value);
              }}
              label="Alumno"
              renderValue={(selected) => {
              if (selected === "") {
                return <em>--Seleccione un alumno--</em>;
              }
              const alumno = alumnos.find(a => a.idAlumno === Number(selected));
              return alumno?.nombre || "";
            }}
            >
              <MenuItem value="">
                <em>Seleccione un alumno</em>
              </MenuItem>
              {alumnos.map(a => (
                <MenuItem key={a.idAlumno} value={a.idAlumno.toString()}>{a.nombre}</MenuItem>
              ))}
            </Select>
     
        <div style={{display: "flex", justifyContent: "space-between", gap: "10px"}}>
          {alumnoSeleccionado && (
            <Button disabled={isSelectDisabled} onClick={() => {
              setItemsFiltrados(items.filter( (i: Rutina)=> i.estadoRutina == "ACTIVO"));
              setAlumnoSeleccionado(undefined)
            }}>
              Limpiar Filtro
            </Button>
          )}
          <Button disabled={isSelectDisabled} variant="outlined" startIcon={<FileDownloadIcon />} onClick={() => {
            if(esSeleccionMultiple){
              handleExportSeleccionMultiple();
            }
            else{
              setEsExport(true)
            }
          }}>
            {esSeleccionMultiple ? "Confirmar exportar" : "Exportar"}
          </Button>
          <Button disabled={isSelectDisabled} variant="contained" onClick={handleCrearRutina}>
            <AddIcon></AddIcon>Crear Rutina
          </Button>
        </div>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Alumno</TableCell>
              <TableCell>Objetivo</TableCell>
              <TableCell>Rutina actual</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemsFiltrados.map((r, idx) => (
              <TableRow key={idx}>
                <TableCell>{r.alumno.nombre}</TableCell>
                <TableCell>{r.objetivo}</TableCell>
                <TableCell>{r.jornadasResponseDTO.map(j => {
                  return <p>{j.dia + "-" + j.ejerciciosDeRutinaResponseDTO.map((e) => {return e.grupoMuscular})}</p>
                })}</TableCell>
                <TableCell>
                  <IconButton color="info" onClick={() => handleVerDetalle(r)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handleEditar(idx,r)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleEliminar(r)}>
                    <DeleteIcon />
                  </IconButton>
                  {esSeleccionMultiple && (
                    <input type="checkbox" onChange={(e) => {
                      if(e.target.checked){
                        setRutinasParaExportar([...rutinasParaExportar, r]);
                      }
                      else{
                        setRutinasParaExportar(rutinasParaExportar.filter(rutina => rutina.idRutina != r.idRutina))
                      }
                    }}/>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={(e, r) => {
          if (r === 'backdropClick' || r === 'escapeKeyDown') return;
          setOpen(false);
          setEditingIndex(null);
          setRutina(emptyRutina);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>{editingIndex !== null ? 'Editar Rutina' : 'Nueva Rutina'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Alumno</InputLabel>
            <Select
              displayEmpty
              style={{width: "100%",  backgroundColor: "white", color: "black"}}
                value={rutina.alumno.idAlumno ?? 0}
                onChange={async (e) => {
                  const alumno = alumnos.find(a => a.idAlumno.toString() == e.target.value);
                    if(alumno){
                      setRutina({...rutina, alumno: alumno});
                    }
                }}
                label="Alumno"
                renderValue={(selected) => {
                if (selected === 0) {
                  return <em>--Seleccione un alumno--</em>;
                }
                const alumno = alumnos.find(a => a.idAlumno === Number(selected));
                return alumno?.nombre || 0;
              }}
              >
                <MenuItem value="">
                  <em>Seleccione un alumno</em>
                </MenuItem>
                {alumnos.map(a => (
                  <MenuItem key={a.idAlumno} value={a.idAlumno.toString()}>{a.nombre}</MenuItem>
                ))}
              </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Nombre"
            margin="dense"
            value={rutina.nombre}
            onChange={e => setRutina({ ...rutina, nombre: e.target.value })}
          />
          <TextField
            fullWidth
            label="Objetivo"
            margin="dense"
            value={rutina.objetivo}
            onChange={e => setRutina({ ...rutina, objetivo: e.target.value })}
          />
          <TextField
            fullWidth
            label="Días por Semana"
            margin="dense"
            value={rutina.jornadasResponseDTO?.length}
            onChange={e => setRutina({ ...rutina, diasPorSemana: e.target.value })}
          />
          <div style={{display: "flex", justifyContent: "end"}}>
            <Button size="small" onClick={handleAgregarDia} startIcon={<AddIcon />} sx={{ mt: 2 }}>
              Agregar Día
            </Button>
          </div>
          {rutina.jornadasResponseDTO?.map((d, i) => (
            <Box key={i} sx={{ border: '1px solid #ccc', mt: 2, p: 2 }}>
              <div style={{textAlign: "end"}}>
                <Button style={{color: "gray"}} onClick={() => handleEliminarDia(i)}>
                  <CloseIcon></CloseIcon>
                </Button>
              </div>
              <FormControl fullWidth margin="dense">
                <InputLabel>Día</InputLabel>
                <Select
                  value={d.dia}
                  onChange={e => {
                    const val = String(e.target.value);
                    setRutina(prev => {
                      const copy = { ...prev };
                      copy.jornadasResponseDTO = [...prev.jornadasResponseDTO];
                      copy.jornadasResponseDTO[i] = { ...copy.jornadasResponseDTO[i], dia: val };
                      return copy;
                    });
                  }}
                  label="Día"
                >
                  {diasSemana.map(ds => (
                    <MenuItem key={ds} value={ds}>{ds}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {d.ejerciciosDeRutinaResponseDTO.map((ej, j) => (
                <Box key={j} sx={{ pl: 2, mt: 1 }}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Grupo Muscular</InputLabel>
                    <Select
                      value={ej.grupoMuscular}
                      onChange={e => {
                        const val = String(e.target.value);
                        
                        setRutina(prev => {
                          const copy = { ...prev };
                          copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO[j] = {
                            ...copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO[j],
                            grupoMuscular: val,
                          };
                          return copy;
                        });
                      }}
                      label="Grupo Muscular"
                    >
                      {gruposMusculares.map(gm => (
                        <MenuItem key={gm} value={gm}>{gm}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Ejercicio</InputLabel>
                    <Select
                      value={ej?.ejercicio?.idEjercicio}
                      onChange={e => {
                        
                        setRutina(prev => {
                          const copy = { ...prev };
                          copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO[j] = {
                            ...copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO[j],
                            ejercicio: {
                              idEjercicio: Number(e.target.value),
                              id: "",
                              nombre: ""
                            }
                          };
                          return copy;
                        });
                      }}
                      label="Ejercicio"
                    >
                      <MenuItem value="">
                        <em>Seleccione un ejercicio</em>
                      </MenuItem>
                      {ejercicios?.map(ex => (
                        <MenuItem key={ex.idEjercicio} value={Number(ex.idEjercicio)}>{ex.nombre}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Series"
                    margin="dense"
                    value={ej.rondas}
                    onChange={e => {
                      const val = e.target.value;
                      setRutina(prev => {
                        const copy = { ...prev };
                        copy.jornadasResponseDTO = [...prev.jornadasResponseDTO];
                        copy.jornadasResponseDTO[i] = { ...copy.jornadasResponseDTO[i] };
                        copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO = [...copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO];
                        copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO[j] = {
                          ...copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO[j],
                          rondas: val,
                        };
                        return copy;
                      });
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Repeticiones"
                    margin="dense"
                    value={ej.repeticiones}
                    onChange={e => {
                      const val = e.target.value;
                      setRutina(prev => {
                        const copy = { ...prev };
                        copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO[j] = {
                          ...copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO[j],
                          repeticiones: val,
                        };
                        return copy;
                      });
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Carga"
                    margin="dense"
                    value={ej.carga}
                    onChange={e => {
                      const val = e.target.value;
                      setRutina(prev => {
                        const copy = { ...prev };
                        copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO[j] = {
                          ...copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO[j],
                          carga: val,
                        };
                        return copy;
                      });
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Observaciones"
                    margin="dense"
                    value={ej.observaciones}
                    onChange={e => {
                      const val = e.target.value;
                      setRutina(prev => {
                        const copy = { ...prev };
                        copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO[j] = {
                          ...copy.jornadasResponseDTO[i].ejerciciosDeRutinaResponseDTO[j],
                          observaciones: val,
                        };
                        return copy;
                      });
                    }}
                  />
                  <div style={{textAlign: "end"}}>
                    <Button size="small" onClick={() => handleEliminarEjercicio(i,j)}>
                      <DeleteIcon style={{color: "red"}}/>
                    </Button>
                  </div>
                </Box>
              ))}
              <Button size="small" onClick={() => handleAgregarEjercicio(i)} startIcon={<AddIcon />}>
                Agregar Ejercicio
              </Button>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
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
        <DialogTitle>
          Detalle de rutina por alumno {detalle?.alumno?.nombre}
        </DialogTitle>
        
        <DialogContent dividers>
          {detalle && (
            <Box>
              <Typography><strong>Nombre:</strong> {detalle.nombre}</Typography>
              <Typography><strong>Objetivo del alumno:</strong> {detalle.objetivo}</Typography>
              <Typography><strong>Días por semana:</strong> {detalle.diasPorSemana}</Typography>
              {detalle?.jornadasResponseDTO?.map((d, i) => (
                <Box key={i} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">{d.dia}</Typography>
                  {d.ejerciciosDeRutinaResponseDTO?.map((e, j) => (
                    <Box key={j} sx={{ pl: 0}}>
                      <Typography><strong>Grupo: {e.grupoMuscular}</strong></Typography>
                      <Typography>- Ejercicio: {e.ejercicio.nombre}</Typography>
                      <Typography>- Series: {e.rondas}</Typography>
                      <Typography>- Repeticiones: {e.repeticiones}</Typography>
                      <Typography>- Carga: {e.carga}</Typography>
                      {e.observaciones && (
                        <Typography>- Obs: {e.observaciones}</Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalle(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={esExport}>
        <DialogTitle>
          ¿De que manera desea exportar las rutinas?
        </DialogTitle>
        <DialogContent>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <Button sx={{
              "&:hover": {
                  backgroundColor: "#ed6c02",
                  cursor: "pointer",
                  color: "white"
                }
            }} onClick={handleExport}>Un solo alumno</Button>
            <Button sx={{
              "&:hover": {
                  backgroundColor: "#ed6c02",
                  cursor: "pointer",
                  color: "white"
                }
            }} onClick={ajustarParaSeleccionarVarios}>Varios alumnos</Button>
          </div>
        </DialogContent>
      </Dialog>
      {
        isLoading && (
          <div style={{ textAlign: "center", marginTop: "10px"}}>
            <CircularProgress/>
          </div>
        )
      }
    </Box>
  );
};

export default Rutinas;
