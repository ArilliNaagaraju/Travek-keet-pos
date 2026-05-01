import { useState } from 'react';
import { Box, Button, Grid2 as Grid, Typography, Paper, Link, Alert, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from '../../assets/logo.jpeg';
import truckImage from '../../assets/truckimage.jpeg';

export default function UserRegisterPage({ onRegisterSuccess, onBackToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data?.data?.token) {
          localStorage.setItem('token', data.data.token);
        }
        if (data?.data?.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
        alert('Registration successful! Continue with provider details.');
        onRegisterSuccess && onRegisterSuccess();
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Could not connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const inputSx = {
    width: '100%',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    height: '56px',
    padding: '0 14px',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 1180, borderRadius: 3, overflow: 'hidden' }}>
        <Grid container>
          {/* Left Panel */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ mb: 4, width: 'fit-content' }}>
              <img src={logo} alt="TravelKeet" style={{ width: 220, maxWidth: '100%', display: 'block' }} />
            </Box>
            
            <Typography variant="h1" sx={{ mb: 1 }}>Create Account</Typography>
            <Typography variant="body2" sx={{ mb: 4, maxWidth: 520 }}>
              Join TravelKeet today and start your journey with us.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Full Name</Typography>
                <Box component="input" value={name} onChange={(e) => setName(e.target.value)} required sx={inputSx} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Email</Typography>
                <Box component="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required sx={inputSx} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Password</Typography>
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component="input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{ ...inputSx, pr: '56px' }}
                  />
                  <InputAdornment position="end" sx={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link 
                    href="#" 
                    underline="hover" 
                    color="primary.main" 
                    sx={{ fontWeight: 500 }} 
                    onClick={(e) => { e.preventDefault(); onBackToLogin && onBackToLogin(); }}
                  >
                    Login here
                  </Link>
                </Typography>
              </Box>
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                disabled={loading}
                sx={{ width: { xs: '100%', sm: 230 }, height: 56, mt: 1, borderRadius: 8 }}
              >
                {loading ? 'REGISTERING...' : 'REGISTER'}
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
