import { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid2 as Grid, Paper, IconButton, CircularProgress, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import PeopleIcon from '@mui/icons-material/People';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import logo from "../../assets/logo.jpeg";
import footerLogo from "../../assets/footer.png";

const AMENITIES = [
  { icon: <CheckIcon fontSize="small" />, label: "Bathroom" },
  { icon: <CheckIcon fontSize="small" />, label: "Bedroom" },
  { icon: <PeopleIcon fontSize="small" />, label: "6" },
  { icon: <CheckIcon fontSize="small" />, label: "Kitchen" },
  { icon: <CheckIcon fontSize="small" />, label: "AC" },
  { icon: null, label: "More..." },
];

function CaravanCard({ image, id = "CE001", price = "19", type = "Classic", rating = "4.5", onClick }) {
  const defaultImage = "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80";
  
  return (
    <Paper 
      elevation={3} 
      onClick={onClick}
      sx={{ 
        borderRadius: 2, 
        overflow: 'hidden', 
        bgcolor: '#fff', 
        cursor: 'pointer',
        transition: 'transform 0.2s', 
        '&:hover': { transform: 'translateY(-4px)' } 
      }}
    >
      <Box sx={{ height: 185, overflow: 'hidden' }}>
        <img
          src={image || defaultImage}
          alt="Caravan"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          onError={(e) => { e.target.src = defaultImage; }}
        />
      </Box>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827', fontSize: '15px' }}>{id}</Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827', fontSize: '15px' }}>
            ₹{price}<Typography component="span" sx={{ fontSize: '11px', color: '#6b7280', fontWeight: 400 }}>/per day</Typography>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#4b5563', fontSize: '12px' }}>{type}</Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {["09", "10", "11"].map(n => <Box key={n} sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#22c55e', color: '#fff', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</Box>)}
              {["12", "13", "14"].map(n => <Box key={n} sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#ef4444', color: '#fff', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</Box>)}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ color: '#eab308', fontSize: '14px' }}>★</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px' }}>{rating}</Typography>
          </Box>
        </Box>
        <Box sx={{ borderTop: '1px solid #f3f4f6', pt: 1.5 }}>
          <Grid container rowSpacing={1.5}>
            {AMENITIES.map((amenity, i) => (
              <Grid size={{ xs: 4 }} key={i}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                  {amenity.icon && <Box sx={{ color: '#111827' }}>{amenity.icon}</Box>}
                  <Typography sx={{ fontSize: '10px', color: '#4b5563', fontWeight: 500, mt: amenity.icon ? 0 : 2.5 }}>{amenity.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
}

export default function CaravanListingPage({ onSelectCaravan, onLogout, onAddCaravan }) {
  const [caravans, setCaravans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogoutClick = () => {
    handleMenuClose();
    setLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    setLogoutDialogOpen(false);
    localStorage.clear();
    onLogout && onLogout();
  };

  useEffect(() => {
    const fetchCaravans = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/caravans');
        const data = await response.json();
        if (response.ok) {
          setCaravans(data.data);
        }
      } catch (error) {
        console.error('Error fetching caravans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaravans();
  }, []);

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', bgcolor: '#fff' }}>
          
          {/* Header */}
          <Box sx={{ px: { xs: 3, md: 6 }, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <img src={logo} alt="TravelKeet" style={{ height: 40 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => onAddCaravan && onAddCaravan()}
                sx={{ borderRadius: 8, color: '#374151', borderColor: '#d1d5db', textTransform: 'none', px: 3, fontWeight: 600 }}
              >
                Become a service provider
              </Button>
              <IconButton 
                onClick={handleMenuOpen}
                sx={{ border: '1px solid #d1d5db', color: '#374151' }}
              >
                <PersonOutlineIcon />
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: 1 }}
              >
                <MenuItem onClick={() => { handleMenuClose(); onAddCaravan && onAddCaravan(); }}>Add Caravan</MenuItem>
                <MenuItem onClick={handleLogoutClick} sx={{ color: '#ef4444' }}>Logout</MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Logout Confirmation Dialog */}
          <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
            <DialogTitle sx={{ fontWeight: 800 }}>Confirm Logout</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to log out from TravelKeet?</Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setLogoutDialogOpen(false)} sx={{ color: '#6b7280', fontWeight: 700 }}>Cancel</Button>
              <Button onClick={confirmLogout} variant="contained" sx={{ bgcolor: '#ef4444', fontWeight: 700, '&:hover': { bgcolor: '#dc2626' } }}>OK</Button>
            </DialogActions>
          </Dialog>

          {/* Hero Section */}
          <Box sx={{ position: 'relative', px: { xs: 2, md: 4 } }}>
            <Box sx={{ 
              height: { xs: 300, md: 400 }, 
              borderRadius: 4, 
              backgroundImage: 'url(https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1600&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              pb: 4
            }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[1,2,3,4].map(i => <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: i===1 ? '#52d88d' : '#fff' }} />)}
              </Box>
            </Box>

            {/* Floating Search Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: -4, position: 'relative', zIndex: 10 }}>
              <Paper elevation={4} sx={{ borderRadius: '100px', display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', alignItems: 'center', p: 1, px: { xs: 2, md: 3 }, gap: { xs: 1, md: 2 }, bgcolor: '#fff', maxWidth: '95%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: { xs: 1, md: 2 } }}>
                  <Box sx={{ bgcolor: '#52d88d', p: 1, borderRadius: '50%', color: '#fff', display: 'flex' }}><LocationOnIcon fontSize="small" /></Box>
                  <Typography sx={{ fontWeight: 500, color: '#374151', whiteSpace: 'nowrap' }}>Ooty</Typography>
                </Box>
                <Box sx={{ width: '1px', minWidth: '1px', height: 40, bgcolor: '#e5e7eb' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: { xs: 1, md: 2 } }}>
                  <Box sx={{ bgcolor: '#52d88d', p: 1, borderRadius: '50%', color: '#fff', display: 'flex' }}><LocationOnIcon fontSize="small" /></Box>
                  <Typography sx={{ fontWeight: 500, color: '#374151', whiteSpace: 'nowrap' }}>Chennai</Typography>
                </Box>
                <Box sx={{ width: '1px', minWidth: '1px', height: 40, bgcolor: '#e5e7eb' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: { xs: 1, md: 2 } }}>
                  <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '6px 10px', borderRadius: 6, bgcolor: '#f8fafc' }}>
                    <Box sx={{ bgcolor: '#f1f5f9', p: 1, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CalendarMonthIcon fontSize="small" sx={{ color: '#059669' }} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                      <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '13px' }}>07 Dec 2001</Typography>
                      <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>16 Feb 2004</Typography>
                    </Box>
                    <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', color: '#94a3b8' }}>—</Box>
                  </Paper>
                </Box>
                <IconButton sx={{ bgcolor: '#52d88d', color: '#fff', '&:hover': { bgcolor: '#4ade80' }, ml: { xs: 1, md: 2 }, width: 44, height: 44, flexShrink: 0 }}>
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Box>
          </Box>

          {/* Filters */}
          <Box sx={{ px: { xs: 4, md: 8 }, mt: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', pb: 2, mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>Search Result</Typography>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>Home &gt; Campervan</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151', fontSize: '13px' }}>Price</Typography>
                <KeyboardArrowDownIcon fontSize="small" sx={{ color: '#6b7280' }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151', fontSize: '13px' }}>Driven Style</Typography>
                <KeyboardArrowDownIcon fontSize="small" sx={{ color: '#6b7280' }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151', fontSize: '13px' }}>More Filters</Typography>
                <KeyboardArrowDownIcon fontSize="small" sx={{ color: '#6b7280' }} />
              </Box>
            </Box>
          </Box>

          {/* Grid */}
          <Box sx={{ px: { xs: 4, md: 8 }, mb: 8 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress color="success" /></Box>
            ) : (
              <Grid container spacing={4}>
                {caravans.length > 0 ? (
                  caravans.map((caravan, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={caravan._id || index}>
                      <CaravanCard 
                        image={caravan.details?.displayImages?.[0]} 
                        id={caravan.details?.vehicleNumber || `CE${index + 1}`}
                        price={caravan.pricing?.pricePerNight || "19"}
                        type={caravan.details?.vehicleType || "Classic"}
                        onClick={() => onSelectCaravan && onSelectCaravan(caravan)}
                      />
                    </Grid>
                  ))
                ) : (
                  <Box sx={{ width: '100%', py: 8, textAlign: 'center' }}>
                    <Typography color="textSecondary">No caravans found. Add your first caravan!</Typography>
                  </Box>
                )}
              </Grid>
            )}
          </Box>

          {/* Footer */}
          <Box sx={{ bgcolor: '#52d88d', color: '#fff', px: { xs: 4, md: 10 }, py: 6 }}>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, md: 5 }}>
                <img src={footerLogo} alt="TravelKeet" style={{ height: 46, display: 'block', marginBottom: '16px', objectFit: 'contain' }} />
                <Typography sx={{ fontSize: '13px', lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>
                  In an industry witnessing expected growth, TravelKeet is truly carving a name for itself by adding value to enjoyable vacation destinations. We are not just building tourism facilities, we're creating experiences!
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '13px', textTransform: 'uppercase' }}>COMPANY</Typography>
                {['Our Vehicles', 'About Us', 'Blogs', 'FAQ'].map(t => (
                  <Typography key={t} sx={{ fontSize: '13px', mb: 1.5, color: 'rgba(255,255,255,0.9)', cursor: 'pointer' }}>{t}</Typography>
                ))}
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '13px', textTransform: 'uppercase' }}>SERVICES</Typography>
                {['Campervan', 'CFC'].map(t => (
                  <Typography key={t} sx={{ fontSize: '13px', mb: 1.5, color: 'rgba(255,255,255,0.9)', cursor: 'pointer' }}>{t}</Typography>
                ))}
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '13px', textTransform: 'uppercase' }}>INFORMATION</Typography>
                {['Contact', 'Privacy Policy', 'Terms & Conditions'].map(t => (
                  <Typography key={t} sx={{ fontSize: '13px', mb: 1.5, color: 'rgba(255,255,255,0.9)', cursor: 'pointer' }}>{t}</Typography>
                ))}
              </Grid>
            </Grid>
            <Typography sx={{ textAlign: 'center', mt: 6, fontSize: '12px', opacity: 0.8 }}>© 2024 Copyright: TravelKeet</Typography>
          </Box>

        </Box>
      </Box>
  );
}
