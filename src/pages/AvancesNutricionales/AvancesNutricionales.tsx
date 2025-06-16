import React, { useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from "@mui/material";

interface Item {
  id: number;
  fecha: string;
  peso: string;
  grasaCorporal: string;
}

const AvancesNutricionales = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [nuevo, setNuevo] = useState<Item>({ id: 0, fecha: "", peso: "", grasaCorporal: "" });

  const handleOpen = () => {
    setNuevo({ id: 0, fecha: "", peso: "", grasaCorporal: "" });
    setOpen(true);
  };

  const handleGuardar = () => {
    setItems([...items, { ...nuevo, id: items.length + 1 }]);
    setOpen(false);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Gestión de AvancesNutricionales</Typography>
      <Button variant="contained" color="warning" onClick={handleOpen}>
        Nuevo AvancesNutricionales
      </Button>
      <TableContainer component={Paper}sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Peso</TableCell>
              <TableCell>Grasacorporal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.fecha}</TableCell>
                <TableCell>{item.peso}</TableCell>
                <TableCell>{item.grasaCorporal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nuevo AvancesNutricionales</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Fecha" value={nuevo.fecha} onChange={(e) => setNuevo({ ...nuevo, fecha: e.target.value })} />
          <TextField fullWidth margin="dense" label="Peso" value={nuevo.peso} onChange={(e) => setNuevo({ ...nuevo, peso: e.target.value })} />
          <TextField fullWidth margin="dense" label="Grasacorporal" value={nuevo.grasaCorporal} onChange={(e) => setNuevo({ ...nuevo, grasaCorporal: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AvancesNutricionales;
