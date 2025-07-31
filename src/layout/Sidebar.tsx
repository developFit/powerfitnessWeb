import React, { useState } from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";
import EventIcon from "@mui/icons-material/Event";
import TimelineIcon from "@mui/icons-material/Timeline";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { AddTask } from "@mui/icons-material";
import logo from "../assets/logo.svg";

const drawerWidth = 240;

const SidebarResponsive = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
        <img src={logo} alt="Logo" style={{ height: 40 }} />
      </Toolbar>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><HomeIcon sx={{ color: "#FFA726" }} /></ListItemIcon>
          <ListItemText primary="Inicio" primaryTypographyProps={{ sx: { color: "#ffff" } }} />
        </ListItem>
        <ListItem button component={Link} to="/alumnos">
          <ListItemIcon><PeopleIcon sx={{ color: "#FFA726" }} /></ListItemIcon>
          <ListItemText primary="Alumnos" primaryTypographyProps={{ sx: { color: "#ffff" } }} />
        </ListItem>
        <ListItem button component={Link} to="/ConfiguracionAlumnos">
          <ListItemIcon><AddTask sx={{ color: "#FFA726" }} /></ListItemIcon>
          <ListItemText primary="ValidarRutinas" primaryTypographyProps={{ sx: { color: "#ffff" } }} />
        </ListItem>
        <ListItem button component={Link} to="/rutinas">
          <ListItemIcon><FitnessCenterIcon sx={{ color: "#FFA726" }} /></ListItemIcon>
          <ListItemText primary="Rutinas" primaryTypographyProps={{ sx: { color: "#ffff" } }} />
        </ListItem>
        <ListItem button component={Link} to="/ejercicios">
          <ListItemIcon><SportsGymnasticsIcon sx={{ color: "#FFA726" }} /></ListItemIcon>
          <ListItemText primary="Ejercicios" primaryTypographyProps={{ sx: { color: "#ffff" } }} />
        </ListItem>
        <ListItem button component={Link} to="/platos">
          <ListItemIcon><FastfoodIcon sx={{ color: "#FFA726" }} /></ListItemIcon>
          <ListItemText primary="Platos" primaryTypographyProps={{ sx: { color: "#ffff" } }} />
        </ListItem>
        <ListItem button component={Link} to="/planes-membresia">
          <ListItemIcon><MonetizationOnIcon sx={{ color: "#FFA726" }} /></ListItemIcon>
          <ListItemText primary="Planes de Membresía" primaryTypographyProps={{ sx: { color: "#ffff" } }} />
        </ListItem>
        <ListItem button component={Link} to="/planes">
          <ListItemIcon><RestaurantMenuIcon sx={{ color: "#FFA726" }} /></ListItemIcon>
          <ListItemText primary="Planes Nutricionales" primaryTypographyProps={{ sx: { color: "#ffff" } }} />
        </ListItem>
        <ListItem button component={Link} to="/asistencias">
          <ListItemIcon><EventIcon sx={{ color: "#FFA726" }} /></ListItemIcon>
          <ListItemText primary="Asistencias" primaryTypographyProps={{ sx: { color: "#ffff" } }} />
        </ListItem>
        <ListItem button component={Link} to="/avances">
          <ListItemIcon><TimelineIcon sx={{ color: "#FFA726" }} /></ListItemIcon>
          <ListItemText primary="Avances" primaryTypographyProps={{ sx: { color: "#ffff" } }} />
        </ListItem>
        <ListItem button component={Link} to="/cuentas">
          <ListItemIcon><AccountBalanceWalletIcon sx={{ color: "#FFA726" }} /></ListItemIcon>
          <ListItemText primary="Cuenta Corriente" primaryTypographyProps={{ sx: { color: "#ffff" } }} />
        </ListItem>
        <ListItem button component={Link} to="/cuotas">
          <ListItemIcon><AssignmentIcon sx={{ color: "#FFA726" }} /></ListItemIcon>
          <ListItemText primary="Cuotas Pendientes" primaryTypographyProps={{ sx: { color: "#ffff" } }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ m: 1, position: "fixed", zIndex: 1300 }}
        >
          <MenuIcon sx={{ color: "#FFA726" }} />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1e1e1e",
            color: "#FFA726",
            height: "100vh",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default SidebarResponsive;
