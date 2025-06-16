import React, { useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from "@mui/material";

interface Item {
  id: number;
  fecha: string;
  tipo: string;
  observaciones: string;
}

const Asistencias = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [nuevo, setNuevo] = useState<Item>({ id: 0, fecha: "", tipo: "", observaciones: "" });

  const handleOpen = () => {
    setNuevo({ id: 0, fecha: "", tipo: "", observaciones: "" });
    setOpen(true);
  };

  const handleGuardar = () => {
    setItems([...items, { ...nuevo, id: items.length + 1 }]);
    setOpen(false);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Gestión de Asistencias</Typography>
      <Button variant="contained" color="warning" onClick={handleOpen}>
        Nuevo Asistencias
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Observaciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.fecha}</TableCell>
                <TableCell>{item.tipo}</TableCell>
                <TableCell>{item.observaciones}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nuevo Asistencias</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Fecha" value={nuevo.fecha} onChange={(e) => setNuevo({ ...nuevo, fecha: e.target.value })} />
          <TextField fullWidth margin="dense" label="Tipo" value={nuevo.tipo} onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })} />
          <TextField fullWidth margin="dense" label="Observaciones" value={nuevo.observaciones} onChange={(e) => setNuevo({ ...nuevo, observaciones: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Asistencias;
