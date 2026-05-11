import { useState } from 'react';
import { Box, Typography, Button, Grid2 as Grid, Container, Paper, Alert } from '@mui/material';
import footerLogo from "../../assets/footer.png";

function Pair({ label, placeholder, type = "text", isFile = false, value, onChange, name }) {
  const fieldSx = {
    width: '100%',
    border: '1px solid #79d7ac',
    borderRadius: '6px',
    backgroundColor: '#fff',
    height: '40px',
    padding: '0 12px',
    fontSize: '13px',
    color: '#1f2937',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Typography variant="body2" sx={{ minWidth: { sm: 160 }, fontWeight: 500, color: '#4a5568', fontSize: '14px' }}>
          {label}
        </Typography>
        {isFile ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #79d7ac', borderRadius: 1.5, overflow: 'hidden', height: 40, bgcolor: '#fff' }}>
            <Button
              component="label"
              sx={{ bgcolor: '#e2e8f0', color: '#4a5568', borderRadius: 0, height: '100%', px: 2, textTransform: 'none', minWidth: 'auto', '&:hover': { bgcolor: '#cbd5e1' } }}
            >
              Choose File
              <input type="file" hidden onChange={(e) => onChange(name, e.target.files[0])} />
            </Button>
            <Typography variant="caption" sx={{ color: '#a0aec0', px: 2 }}>
              {value ? value.name : "No file chosen"}
            </Typography>
          </Box>
        ) : (
          <Box
            component="input"
            placeholder={placeholder}
            type={type}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            sx={fieldSx}
          />
        )}
      </Box>
    </Grid>
  );
}

export default function RegisterPage({ onCancel, onSubmit }) {
  const [formData, setFormData] = useState({
    ownerName: 'Aarav Sharma',
    email: 'aarav.sharma@suntrailmobility.in',
    altNumber: '9876543210',
    photo: { name: 'aarav-sharma-photo.jpg' },
    aadhaar: { name: 'aarav-sharma-aadhaar.pdf' },
    pan: { name: 'suntrailmobility-pan.pdf' },
    brandName: 'SunTrail Campers',
    company: 'SunTrail Mobility Pvt Ltd',
    ownership: 'Private Limited',
    officeAddress: '42, MG Road, Indiranagar',
    state: 'Karnataka',
    zipCode: '560038',
    city: 'Bengaluru',
    companyGst: '29ABCDE1234F1Z5'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    // In a real app, we'd use FormData for files. For now, we'll send a JSON.
    // Note: This won't actually upload files to the server without further backend work (multer),
    // but it will save the text data.
    
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    const payload = {
      userId: user ? user._id : null,
      basicInfo: {
        ownerName: formData.ownerName,
        email: formData.email,
        altNumber: formData.altNumber,
        photo: formData.photo ? formData.photo.name : '',
        aadhaar: formData.aadhaar ? formData.aadhaar.name : '',
        pan: formData.pan ? formData.pan.name : ''
      },
      brandInfo: {
        brandName: formData.brandName,
        company: formData.company,
        ownership: formData.ownership,
        officeAddress: formData.officeAddress,
        state: formData.state,
        zipCode: formData.zipCode,
        city: formData.city,
        companyGst: formData.companyGst
      }
    };

    try {
      const response = await fetch('http://localhost:5000/api/providers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data._id) {
          localStorage.setItem('providerId', data.data._id);
        }
        alert('Caravan Provider Registration Successful!');
        onSubmit && onSubmit();
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Could not connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: '#fff' }}>
          
          <Box sx={{ p: { xs: 4, md: 8 }, pb: { xs: 4, md: 6 } }}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#334155', mb: 1.5, letterSpacing: 0.5 }}>
                CREATE ACCOUNT
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                Please fill this form & let us know about services that you want to provide.
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box sx={{ mb: 7 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155', mb: 0.5 }}>
                BASIC INFORMATION
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>
                Please fill this form & let us know...
              </Typography>

              <Grid container columnSpacing={4} rowSpacing={3}>
                <Pair label="Owner/ Company Name" placeholder="Enter Owner/Company Name" name="ownerName" value={formData.ownerName} onChange={handleChange} />
                <Pair label="Email Address" placeholder="Enter Email" type="email" name="email" value={formData.email} onChange={handleChange} />
                <Pair label="Alternative Number" placeholder="Phone Number" type="tel" name="altNumber" value={formData.altNumber} onChange={handleChange} />
                <Pair label="Owner/ Authorized Person Photo" isFile={true} name="photo" value={formData.photo} onChange={handleChange} />
                <Pair label="Owner/ Authorised person Aadhaar" isFile={true} name="aadhaar" value={formData.aadhaar} onChange={handleChange} />
                <Pair label="Owner/ Company PAN" isFile={true} name="pan" value={formData.pan} onChange={handleChange} />
              </Grid>
            </Box>

            <Box sx={{ mb: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155', mb: 0.5 }}>
                BRAND INFORMATION
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>
                Please fill this form & let us know...
              </Typography>

              <Grid container columnSpacing={4} rowSpacing={3}>
                <Pair label="Brand Name" placeholder="Enter Brand Name" name="brandName" value={formData.brandName} onChange={handleChange} />
                <Pair label="Company" placeholder="Enter company" name="company" value={formData.company} onChange={handleChange} />
                <Pair label="Ownership" placeholder="" name="ownership" value={formData.ownership} onChange={handleChange} />
                <Pair label="Office Address" placeholder="Enter Address" name="officeAddress" value={formData.officeAddress} onChange={handleChange} />
                <Pair label="State" placeholder="State" name="state" value={formData.state} onChange={handleChange} />
                <Pair label="Zip Code" placeholder="Enter Zip Code" name="zipCode" value={formData.zipCode} onChange={handleChange} />
                <Pair label="City" placeholder="City" name="city" value={formData.city} onChange={handleChange} />
                <Pair label="Company GST" placeholder="(Optional)" name="companyGst" value={formData.companyGst} onChange={handleChange} />
              </Grid>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 8 }}>
              <Button 
                variant="outlined" 
                onClick={onCancel} 
                disabled={loading}
                sx={{ 
                  width: 160, 
                  borderRadius: 8, 
                  color: '#ff6b6b', 
                  borderColor: '#ff6b6b', 
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  '&:hover': { borderColor: '#ef4444', bgcolor: '#fff5f5' }
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSubmit} 
                disabled={loading}
                disableElevation
                sx={{ 
                  width: 160, 
                  borderRadius: 8, 
                  bgcolor: '#52d88d', 
                  color: '#fff',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  '&:hover': { bgcolor: '#4ade80' }
                }}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, bgcolor: '#52d88d', color: '#fff', px: { xs: 4, md: 8 }, py: 6 }}>
            <Box sx={{ flex: 1.5, pr: { md: 4 } }}>
              <img src={footerLogo} alt="TravelKeet" style={{ height: 40, background: 'transparent', marginBottom: '16px' }} />
              <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}>
                In an industry witnessing expected growth, Travelkeet is truly carving a
                name for itself by adding value to enjoyable vacation destinations. We
                are not just building tourism facilities; we are creating experiences!
              </Typography>
            </Box>
            <Box sx={{ flex: 0.8 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 2, display: 'block', textTransform: 'uppercase' }}>COMPANY</Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.9)', mb: 1, cursor: 'pointer' }}>Our Vehicles</Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.9)', mb: 1, cursor: 'pointer' }}>About Us</Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.9)', mb: 1, cursor: 'pointer' }}>Blogs</Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.9)', mb: 1, cursor: 'pointer' }}>FAQ</Typography>
            </Box>
            <Box sx={{ flex: 0.8 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 2, display: 'block', textTransform: 'uppercase' }}>SERVICES</Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.9)', mb: 1, cursor: 'pointer' }}>Campervan</Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.9)', mb: 1, cursor: 'pointer' }}>CFC</Typography>
            </Box>
            <Box sx={{ flex: 0.8 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 2, display: 'block', textTransform: 'uppercase' }}>INFORMATION</Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.9)', mb: 1, cursor: 'pointer' }}>Contact</Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.9)', mb: 1, cursor: 'pointer' }}>Privacy Policy</Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.9)', mb: 1, cursor: 'pointer' }}>Terms & Conditions</Typography>
            </Box>
          </Box>

        </Paper>
      </Container>
    </Box>
  );
}
