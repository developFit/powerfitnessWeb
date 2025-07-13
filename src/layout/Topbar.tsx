import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#000" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ color: "#FFA726" }}>
          Powerfitness By Gaby
        </Typography>
        <Button color="inherit" onClick={handleLogout}>Salir</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
