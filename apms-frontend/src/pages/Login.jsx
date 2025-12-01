import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Container, Paper, TextField, Button, Typography, Box, Grid, Link as MuiLink } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token);
      toast.success("Welcome back!");
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid Credentials. Please try again.');
    }
  };

  return (
    <Grid container component="main" sx={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Container maxWidth="xs">
        {/* NOTE: We removed the manual 'backgroundColor' and 'backdropFilter' properties 
           that were here previously. The updated theme.js now handles the 
           Glassmorphism effect globally for all Paper components, ensuring 
           it looks correct in both Light and Dark modes.
        */}
        <Paper 
          elevation={24} 
          sx={{ 
            p: 5, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            borderRadius: 4, 
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56, boxShadow: '0 4px 14px rgba(0,122,255,0.4)' }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          
          <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 800, background: '-webkit-linear-gradient(45deg, #007AFF, #5856D6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            APMS
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to continue
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 4, mb: 2, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
            >
              Sign In
            </Button>
            
            <Grid container justifyContent="center">
              <Grid item>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <Typography color="primary" fontWeight={600}>Create an account</Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Grid>
  );
};

export default Login;