import React, { useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from "@mui/material";

interface Item {
  id: number;
  plan: string;
  montoCuota: string;
  vencimiento: string;
}

const PlanesYCuotasPendientes = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [nuevo, setNuevo] = useState<Item>({ id: 0, plan: "", montoCuota: "", vencimiento: "" });

  const handleOpen = () => {
    setNuevo({ id: 0, plan: "", montoCuota: "", vencimiento: "" });
    setOpen(true);
  };

  const handleGuardar = () => {
    setItems([...items, { ...nuevo, id: items.length + 1 }]);
    setOpen(false);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Gestión de PlanesYCuotasPendientes</Typography>
      <Button variant="contained" color="warning" onClick={handleOpen}>
        Nuevo PlanesYCuotasPendientes
      </Button>
   <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Montocuota</TableCell>
              <TableCell>Vencimiento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.plan}</TableCell>
                <TableCell>{item.montoCuota}</TableCell>
                <TableCell>{item.vencimiento}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nuevo PlanesYCuotasPendientes</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Plan" value={nuevo.plan} onChange={(e) => setNuevo({ ...nuevo, plan: e.target.value })} />
          <TextField fullWidth margin="dense" label="Montocuota" value={nuevo.montoCuota} onChange={(e) => setNuevo({ ...nuevo, montoCuota: e.target.value })} />
          <TextField fullWidth margin="dense" label="Vencimiento" value={nuevo.vencimiento} onChange={(e) => setNuevo({ ...nuevo, vencimiento: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlanesYCuotasPendientes;
