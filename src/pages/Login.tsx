import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogin = () => {
    if (!email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/home");
    }, 1500);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        pt: isMobile ? "10vh" : "15vh",
        px: 2,
      }}
    >
      <Card
        sx={{
          width: isMobile ? "100%" : 380,
          maxWidth: 400,
          backgroundColor: "#1e1e1e",
          color: "#fff",
          boxShadow: 4,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            gutterBottom
            sx={{ color: "#FFA726", textAlign: "center" }}
          >
            Iniciar Sesión
          </Typography>
          <TextField
            fullWidth
            label="Correo"
            type="email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { color: "#FFA726" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: "#FFA726" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#FFA726",
              color: "#000",
              "&:hover": {
                backgroundColor: "#fb8c00",
              },
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;