import React, { useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from "@mui/material";

interface Item {
  id: number;
  monto: string;
  fecha: string;
  detalle: string;
}

const CuentasCorrientes = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [nuevo, setNuevo] = useState<Item>({ id: 0, monto: "", fecha: "", detalle: "" });

  const handleOpen = () => {
    setNuevo({ id: 0, monto: "", fecha: "", detalle: "" });
    setOpen(true);
  };

  const handleGuardar = () => {
    setItems([...items, { ...nuevo, id: items.length + 1 }]);
    setOpen(false);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Gestión de CuentasCorrientes</Typography>
      <Button variant="contained" color="warning" onClick={handleOpen}>
        Nuevo CuentasCorrientes
      </Button>
      <TableContainer component={Paper}sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Detalle</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.monto}</TableCell>
                <TableCell>{item.fecha}</TableCell>
                <TableCell>{item.detalle}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nuevo CuentasCorrientes</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Monto" value={nuevo.monto} onChange={(e) => setNuevo({ ...nuevo, monto: e.target.value })} />
          <TextField fullWidth margin="dense" label="Fecha" value={nuevo.fecha} onChange={(e) => setNuevo({ ...nuevo, fecha: e.target.value })} />
          <TextField fullWidth margin="dense" label="Detalle" value={nuevo.detalle} onChange={(e) => setNuevo({ ...nuevo, detalle: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CuentasCorrientes;
