import React, { useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from "@mui/material";

interface Item {
  id: number;
  nombre: string;
  descripcion: string;
  caloriasObjetivo: string;
}

const PlanesNutricionales = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [nuevo, setNuevo] = useState<Item>({ id: 0, nombre: "", descripcion: "", caloriasObjetivo: "" });

  const handleOpen = () => {
    setNuevo({ id: 0, nombre: "", descripcion: "", caloriasObjetivo: "" });
    setOpen(true);
  };

  const handleGuardar = () => {
    setItems([...items, { ...nuevo, id: items.length + 1 }]);
    setOpen(false);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Gestión de PlanesNutricionales</Typography>
      <Button variant="contained" color="warning" onClick={handleOpen}>
        Nuevo PlanesNutricionales
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripcion</TableCell>
              <TableCell>Caloriasobjetivo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>{item.descripcion}</TableCell>
                <TableCell>{item.caloriasObjetivo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nuevo PlanesNutricionales</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Nombre" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
          <TextField fullWidth margin="dense" label="Descripcion" value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} />
          <TextField fullWidth margin="dense" label="Caloriasobjetivo" value={nuevo.caloriasObjetivo} onChange={(e) => setNuevo({ ...nuevo, caloriasObjetivo: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlanesNutricionales;
