import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Topbar = () => (
  <AppBar position="static" sx={{ backgroundColor: "#000" }}>
    <Toolbar>
      <Typography variant="h6" sx={{ color: "#FFA726" }}>
        Powerfitness By Gaby
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Topbar;
