import React, { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Llamamos al servicio de autenticación que guarda el token simulado
      await AuthService.login(username, password);

      // Si el login es exitoso redirigimos al inicio protegido
      navigate('/');
    } catch (err) {
      // Si algo falla mostramos un mensaje de error
      setError('Credenciales incorrectas');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000' }}>
      <Card sx={{ width: 300 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>Ingresar</Typography>
            <TextField label="Usuario" variant="outlined" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
            <TextField label="Contrase\u00f1a" type="password" variant="outlined" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Login</Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
