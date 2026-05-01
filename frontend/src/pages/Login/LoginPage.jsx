import { useState } from 'react';
import { Box, Button, Grid2 as Grid, TextField, Typography, Paper, Link, Alert, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from '../../assets/logo.jpeg';
import truckImage from '../../assets/truckimage.jpeg';

export default function LoginPage({ onSignIn, onGoToRegister }) {
  const [email, setEmail] = useState('manigokul@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        onSignIn && onSignIn();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Could not connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 1180, borderRadius: 3, overflow: 'hidden' }}>
        <Grid container>
          {/* Left Panel */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ mb: 4, width: 'fit-content' }}>
              <img src={logo} alt="TravelKeet" style={{ width: 220, maxWidth: '100%', display: 'block' }} />
            </Box>
            
            <Typography variant="h1" sx={{ mb: 1 }}>Welcome to TravelKeet</Typography>
            <Typography variant="body2" sx={{ mb: 4, maxWidth: 520 }}>
              Sign in with your login credentials to get access to the admin application
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                fullWidth
                required
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password here..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="#" underline="hover" color="error.main" sx={{ fontWeight: 500 }} onClick={(e) => e.preventDefault()}>
                  Forgot Password ?
                </Link>
                <Link 
                  href="#" 
                  underline="hover" 
                  color="primary.main" 
                  sx={{ fontWeight: 500 }} 
                  onClick={(e) => { e.preventDefault(); onGoToRegister && onGoToRegister(); }}
                >
                  Create an account
                </Link>
              </Box>
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                disabled={loading}
                sx={{ width: { xs: '100%', sm: 230 }, height: 56, mt: 1, borderRadius: 8 }}
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </Button>
            </Box>
          </Grid>

          {/* Right Panel */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'block' }, bgcolor: '#dfe8f2' }}>
            <img src={truckImage} alt="Travel background" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
