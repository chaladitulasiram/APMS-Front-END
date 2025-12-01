import React, { useState } from 'react';
import api from '../services/api';
import { Container, Paper, TextField, Button, MenuItem, Typography, Box, Grid, Link as MuiLink } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Avatar from '@mui/material/Avatar';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'STUDENT',
    course: '', year: 1, department: '', designation: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data || 'Registration failed');
    }
  };

  return (
    <Grid container component="main" sx={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Paper 
          elevation={24} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            borderRadius: 4,
            // Glassmorphism logic is now handled globally by theme.js, 
            // but we can add specific padding/width overrides here
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
            <AppRegistrationIcon fontSize="large" />
          </Avatar>
          
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            Create Account
          </Typography>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Full Name" name="name" onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email Address" name="email" onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Password" type="password" name="password" onChange={handleChange} required />
              </Grid>
              
              <Grid item xs={12}>
                <TextField select fullWidth label="I am a..." name="role" value={formData.role} onChange={handleChange}>
                  <MenuItem value="STUDENT">Student</MenuItem>
                  <MenuItem value="FACULTY">Faculty</MenuItem>
                </TextField>
              </Grid>

              {formData.role === 'STUDENT' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Course" name="course" onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Year" name="year" type="number" onChange={handleChange} />
                  </Grid>
                </>
              )}

              {formData.role === 'FACULTY' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Department" name="department" onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Designation" name="designation" onChange={handleChange} />
                  </Grid>
                </>
              )}
            </Grid>

            <Button 
              fullWidth 
              variant="contained" 
              type="submit" 
              size="large"
              sx={{ mt: 4, mb: 2, fontSize: '1.1rem' }}
            >
              Register
            </Button>
            
            <Box textAlign="center">
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography color="primary" fontWeight={600}>Already have an account? Sign In</Typography>
              </Link>
            </Box>
          </form>
        </Paper>
      </Container>
    </Grid>
  );
};

export default Register;