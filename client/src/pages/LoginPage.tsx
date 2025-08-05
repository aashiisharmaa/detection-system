import { useState } from 'react';
import { Container, Paper, Avatar, Typography, Alert } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { LoginForm } from '../components/Auth/LoginForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:2000/api/auth/login', {
        email: data.email,
        password: data.password
      });

      localStorage.setItem('authToken', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <LoginForm onSubmit={handleLogin} />
      </Paper>
    </Container>
  );
};