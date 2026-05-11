import { useState } from 'react';
import { Box, Typography, Button, Grid2 as Grid, Container, Paper, IconButton, Avatar, Divider, Accordion, AccordionSummary, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckIcon from '@mui/icons-material/Check';
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';
import logo from "../../assets/logo.jpeg";
import footerLogo from "../../assets/footer.png";
import truckImage from "../../assets/truckimage.jpeg";

const AMENITIES_ICONS = [
  { label: "Bathroom", icon: <CheckIcon fontSize="small" /> },
  { label: "Bedroom", icon: <CheckIcon fontSize="small" /> },
  { label: "6", icon: <PeopleIcon fontSize="small" /> },
  { label: "Kitchen", icon: <CheckIcon fontSize="small" /> },
  { icon: <CheckIcon fontSize="small" />, label: "AC" },
];

const TABS_CONFIG = {
  'Bedroom': [
    { label: 'Sleeping Bed (In Built)', photoKey: 'sleepingBedInBuildPhoto', imgKey: 0 },
    { label: 'Sleeping Bed Pop Up', photoKey: 'sleepingBedPopUpPhoto', imgKey: 1 },
    { label: 'Sleeping Sofa', photoKey: 'sleepingSofaPhoto', imgKey: 2 },
    { label: 'Mobile Charging point', photoKey: 'mobileChargingPhoto', imgKey: 3 },
    { label: 'Moon roof/sun roof', photoKey: 'moonRoofPhoto', imgKey: 4 },
    { label: 'Fan', photoKey: 'fanPhoto', imgKey: 5 },
    { label: 'Air Conditioner', photoKey: 'airConditionerPhoto', imgKey: 6 },
  ],
  'Restroom': [
    { label: 'Toilet', photoKey: 'bathroomPhoto', imgKey: 0 },
    { label: 'Fresh Water Tank', photoKey: 'freshWaterTankPhoto', imgKey: 1 },
    { label: 'Geyser', photoKey: 'geyserPhoto', imgKey: 2 },
  ],
  'Kitchen': [
    { label: 'Microwave', photoKey: 'microwavePhoto', imgKey: 0 },
    { label: 'Refrigerator', photoKey: 'refrigeratorPhoto', imgKey: 1 },
    { label: 'Kitchen (inside)', photoKey: 'kitchenInsidePhoto', imgKey: 2 },
    { label: 'Kitchen (external)', photoKey: 'kitchenExternalPhoto', imgKey: 3 },
  ],
  'Living room': [
    { label: 'Entertainment system', photoKey: 'entertainmentSystemPhoto', imgKey: 0 },
    { label: 'Dinner Table', photoKey: 'dinnerTablePhoto', imgKey: 1 },
    { label: 'Television', photoKey: 'televisionPhoto', imgKey: 2 },
    { label: 'Couple Friendly', photoKey: 'coupleFriendlyPhoto', imgKey: 3 },
    { label: 'Pet Friendly', photoKey: 'petFriendlyPhoto', imgKey: 4 },
  ],
  'Others': [
    { label: 'WiFi', photoKey: 'wifiPhoto', imgKey: 0 },
    { label: 'Battery Inverter', photoKey: 'batteryInverterPhoto', imgKey: 1 },
    { label: 'Security Camera', photoKey: 'securityCameraPhoto', imgKey: 2 },
    { label: 'Iron Box', photoKey: 'ironBoxPhoto', imgKey: 3 },
    { label: 'Parking Assist', photoKey: 'parkingAssistPhoto', imgKey: 4 },
    { label: 'Solar Panel', photoKey: 'solarPanelPhoto', imgKey: 5 },
    { label: 'Camping Tent', photoKey: 'campingTentPhoto', imgKey: 6 },
    { label: 'Camping Accessories', photoKey: 'campingAccessoriesPhoto', imgKey: 7 },
    { label: 'Chauffer Driver', photoKey: 'chautterDriverPhoto', imgKey: 8 },
    { label: 'Awning', photoKey: 'awningPhoto', imgKey: 9 },
  ],
};

function CaravanCardSmall({ id, type, price, rating }) {
  return (
    <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: '#fff', p: 0 }}>
      <Box sx={{ height: 120, backgroundImage: `url(${truckImage})`, backgroundSize: 'cover' }} />
      <Box sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>{id}</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>₹{price}<Typography component="span" sx={{ fontSize: '10px', color: '#6b7280' }}>/per day</Typography></Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '11px', color: '#4b5563' }}>{type} ⭐ {rating}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1, borderTop: '1px solid #f3f4f6', pt: 1 }}>
          <CheckIcon sx={{ fontSize: 14 }} />
          <CheckIcon sx={{ fontSize: 14 }} />
          <PeopleIcon sx={{ fontSize: 14 }} />
        </Box>
      </Box>
    </Paper>
  );
}

export default function CaravanDetailsPage({ caravan, onCompare, onProceedBooking, onGoHome, onLogout, onAddCaravan, onBack }) {
  const galleryImages = caravan?.details?.displayImages?.length
    ? caravan.details.displayImages
    : [truckImage];

  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [selectedMainImage, setSelectedMainImage] = useState(galleryImages[0] || truckImage);
  const [activeTab, setActiveTab] = useState('Bedroom');
  const [lightboxImage, setLightboxImage] = useState(null);

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

  if (!caravan) return null;

  const activeItems = TABS_CONFIG[activeTab] || [];

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', pb: 0 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src={logo} alt="TravelKeet" style={{ height: 40 }} />
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {['Home', 'Become a Partner', 'Services', 'My bookings', 'Contact Us'].map(item => (
              <Typography
                key={item}
                onClick={() => {
                  if (item === 'Home') onGoHome && onGoHome();
                  if (item === 'Become a Partner') onAddCaravan && onAddCaravan();
                }}
                sx={{ fontWeight: 500, fontSize: '12px', cursor: 'pointer', color: '#374151', '&:hover': { color: '#52d88d' } }}
              >
                {item}
              </Typography>
            ))}
            <IconButton
              onClick={handleMenuOpen}
              sx={{ border: '1px solid #d1d5db', color: '#374151', p: 0.5 }}
            >
              <Avatar sx={{ width: 24, height: 24, bgcolor: '#52d88d' }} />
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

        {/* Lightbox Dialog */}
        <Dialog open={!!lightboxImage} onClose={() => setLightboxImage(null)} maxWidth="md" fullWidth>
          <Box sx={{ position: 'relative', bgcolor: '#000' }}>
            <IconButton
              onClick={() => setLightboxImage(null)}
              sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', zIndex: 1, '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
            >
              <CloseIcon />
            </IconButton>
            {lightboxImage && (
              <img src={lightboxImage} alt="Full view" style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block' }} />
            )}
          </Box>
        </Dialog>

        {/* Action Row */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3, mb: 4, mt: 2 }}>
          <Typography sx={{ fontSize: '12px', color: '#374151', cursor: 'pointer' }}>♡ Like</Typography>
          <Typography
            onClick={() => {
              console.log('Compare clicked');
              onCompare && onCompare();
            }}
            sx={{
              fontSize: '12px',
              color: '#374151',
              cursor: 'pointer',
              '&:hover': { color: '#52d88d' }
            }}
          >
            ◫ Compare
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#374151', cursor: 'pointer' }}>↗ Share</Typography>
        </Box>

        {/* Hero Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {galleryImages.slice(0, 6).map((image, i) => (
                  <Box
                    key={`${image}-${i}`}
                    onClick={() => setSelectedMainImage(image)}
                    sx={{
                      width: 60, height: 45, borderRadius: 1, overflow: 'hidden', cursor: 'pointer',
                      border: selectedMainImage === image ? '2px solid #52d88d' : '2px solid transparent',
                      transition: 'border 0.15s',
                    }}
                  >
                    <img src={image || truckImage} alt={`Thumbnail ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                ))}
              </Box>
              <Box
                onClick={() => setLightboxImage(selectedMainImage)}
                sx={{ flex: 1, borderRadius: 2, overflow: 'hidden', height: 330, cursor: 'pointer' }}
              >
                <img src={selectedMainImage} alt="Caravan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#fff', width: 48, height: 48, border: '1px solid #e5e7eb', p: 0.75 }}>
                  <Box component="img" src={logo} alt="TravelKeet" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{caravan.details?.vehicleNumber || "CE001"}</Typography>
                  <Typography sx={{ color: '#6b7280', fontSize: '14px' }}>{caravan.details?.vehicleType || "Classic"}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    console.log('Book Now clicked');
                    onProceedBooking && onProceedBooking();
                  }}
                  sx={{ bgcolor: '#52d88d', borderRadius: 2, textTransform: 'none', px: 4, height: 45, fontWeight: 700 }}
                >
                  BOOK NOW
                </Button>
                <Button variant="contained" sx={{ bgcolor: '#3b82f6', borderRadius: 2, textTransform: 'none', px: 4, height: 45, fontWeight: 700 }}>MESSAGE NOW</Button>
              </Box>
            </Box>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', border: '1px solid #e5e7eb' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>Price Details:</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>⭐ 4.5 &nbsp; 👥 6</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>₹{caravan.pricing?.pricePerNight || "1,999"}<Typography component="span" sx={{ fontSize: '14px', fontWeight: 400 }}>/per day</Typography></Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 3 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ bgcolor: '#52d88d', borderRadius: '50%', p: 0.5, color: '#fff' }}><LocationOnIcon sx={{ fontSize: 14 }} /></Box><Typography sx={{ fontSize: '12px', fontWeight: 600 }}>Ooty</Typography></Box></Grid>
                <Grid size={{ xs: 3 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ bgcolor: '#52d88d', borderRadius: '50%', p: 0.5, color: '#fff' }}><LocationOnIcon sx={{ fontSize: 14 }} /></Box><Typography sx={{ fontSize: '12px', fontWeight: 600 }}>Chennai</Typography></Box></Grid>
                <Grid size={{ xs: 6 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ bgcolor: '#52d88d', borderRadius: '50%', p: 0.5, color: '#fff' }}><CalendarMonthIcon sx={{ fontSize: 14 }} /></Box><Typography sx={{ fontSize: '12px', fontWeight: 600 }}>07-12-2001 &nbsp; 24-12-2001</Typography></Box></Grid>
              </Grid>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, px: 2 }}>
              {AMENITIES_ICONS.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  {item.icon}
                  <Typography sx={{ fontSize: '10px', fontWeight: 600 }}>{item.label}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Details Section */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Georgia, serif' }}>Caravan Details</Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 700, mb: 4 }}>Details of Facility In caravan</Typography>
          <Box component="ul" sx={{ color: '#374151', lineHeight: 2, fontSize: '15px' }}>
            <li>Bedroom: Includes in-built sleeping beds, pop-up beds, sleeping sofas, and features like a moonroof/sunroof, fan, and air conditioner.</li>
            <li>Restroom: Comes with essential fixtures like a toilet, shower, and sink for comfortable hygiene.</li>
            <li>Living Room: Equipped with a mobile charging point, sofa seating, and a relaxing ambiance for leisure or socializing.</li>
            <li>Kitchen: Includes basic cooking facilities, such as a stove, refrigerator, and storage for utensils and supplies.</li>
          </Box>
        </Box>

        {/* Tabs Section */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', gap: 6, borderBottom: '1px solid #e5e7eb', mb: 4 }}>
            {['Bedroom', 'Restroom', 'Kitchen', 'Living room', 'Others'].map((tab) => (
              <Typography
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  fontWeight: 700,
                  pb: 1.5,
                  cursor: 'pointer',
                  borderBottom: activeTab === tab ? '3px solid #52d88d' : '3px solid transparent',
                  color: activeTab === tab ? '#111827' : '#6b7280',
                  transition: 'color 0.15s',
                }}
              >
                {tab}
              </Typography>
            ))}
          </Box>

          <Grid container spacing={3}>
            {activeItems.map((item, i) => {
              const imgSrc = caravan?.amenityPhotos?.[item.photoKey] || galleryImages[item.imgKey] || null;
              return (
                <Grid size={{ xs: 3 }} key={i}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {imgSrc ? (
                      <Box
                        onClick={() => setLightboxImage(imgSrc)}
                        sx={{ width: '100%', height: 120, borderRadius: 2, overflow: 'hidden', mb: 1, cursor: 'pointer', '&:hover': { opacity: 0.85 } }}
                      >
                        <img
                          src={imgSrc}
                          alt={item.label}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ width: '100%', height: 120, borderRadius: 2, mb: 1, bgcolor: '#f3f4f6', border: '1.5px dashed #d1d5db', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '10px', color: '#9ca3af', fontWeight: 600 }}>No Image Found</Typography>
                      </Box>
                    )}
                    <Typography sx={{ textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#111827', maxWidth: 120 }}>{item.label}</Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Rating Section */}
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, mb: 6 }}>
          <Typography sx={{ fontWeight: 700, mb: 3, fontSize: '14px' }}>Rating & Feedback</Typography>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: '#ef4444' }}>H</Avatar>
                <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>Hari Shankar</Typography>
              </Box>
              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 700, fontSize: '14px' }}>⭐ 4.5</Typography>
            </Box>
            <Typography sx={{ fontSize: '13px', color: '#4b5563', pl: 5 }}>Definitely an amazing experience where you'll feel like exploring the world while being within your home.</Typography>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: '#ec4899' }}>R</Avatar>
                <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>Roshni sharma</Typography>
              </Box>
              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 700, fontSize: '14px' }}>⭐ 4.5</Typography>
            </Box>
            <Typography sx={{ fontSize: '13px', color: '#4b5563', pl: 5 }}>"Our family holiday in a campervan gave us the freedom to explore at our place. The kids loved setting up camp under the stars every night. It was such a unique experience — highly recommended!"</Typography>
          </Box>
        </Paper>

        {/* FAQs Section */}
        <Box sx={{ mb: 8 }}>
          <Typography sx={{ textAlign: 'center', fontWeight: 700, mb: 2, fontSize: '14px' }}>FAQs</Typography>
          <Grid container sx={{ border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <Grid size={{ xs: 6 }} sx={{ borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
              <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}><Typography sx={{ fontSize: '12px', fontWeight: 500 }}>1. What documents do I need to rent a caravan?</Typography></AccordionSummary>
              </Accordion>
            </Grid>
            <Grid size={{ xs: 6 }} sx={{ borderBottom: '1px solid #e5e7eb' }}>
              <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}><Typography sx={{ fontSize: '12px', fontWeight: 500 }}>2. What is included in the rental agreement?</Typography></AccordionSummary>
              </Accordion>
            </Grid>
            <Grid size={{ xs: 6 }} sx={{ borderRight: '1px solid #e5e7eb' }}>
              <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}><Typography sx={{ fontSize: '12px', fontWeight: 500 }}>3. Is insurance included in the rental price?</Typography></AccordionSummary>
              </Accordion>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}><Typography sx={{ fontSize: '12px', fontWeight: 500 }}>4. What are the age and driving requirements for renting a caravan?</Typography></AccordionSummary>
              </Accordion>
            </Grid>
          </Grid>
        </Box>

        {/* Similar Caravans */}
        <Grid container spacing={4} sx={{ mb: 10 }}>
          {[1,2,3,4].map(i => (
            <Grid size={{ xs: 3 }} key={i}>
              <CaravanCardSmall id="CE001" type="Classic" price="19" rating="4.5" />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#52d88d', color: '#fff', py: 8, px: { xs: 4, md: 10 } }}>
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 5 }}>
            <img src={footerLogo} alt="TravelKeet Logo" style={{ height: 46, display: 'block', marginBottom: '16px', objectFit: 'contain' }} />
            <Typography sx={{ fontSize: '13px', lineHeight: 1.8, opacity: 0.9 }}>
              In an industry witnessing expected growth, TravelKeet is truly carving a name for itself by adding value to enjoyable vacation destinations. We are not just building tourism facilities, we're creating experiences!
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 3, fontSize: '12px' }}>COMPANY</Typography>
            {['Our Vehicles', 'About Us', 'Blogs', 'FAQ'].map(t => <Typography key={t} sx={{ fontSize: '12px', mb: 1.5, opacity: 0.9, cursor: 'pointer' }}>{t}</Typography>)}
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 3, fontSize: '12px' }}>SERVICES</Typography>
            {['Campervan', 'CFC'].map(t => <Typography key={t} sx={{ fontSize: '12px', mb: 1.5, opacity: 0.9, cursor: 'pointer' }}>{t}</Typography>)}
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 3, fontSize: '12px' }}>INFORMATION</Typography>
            {['Contact', 'Privacy Policy', 'Terms & Conditions'].map(t => <Typography key={t} sx={{ fontSize: '12px', mb: 1.5, opacity: 0.9, cursor: 'pointer' }}>{t}</Typography>)}
          </Grid>
        </Grid>
        <Typography sx={{ textAlign: 'center', mt: 8, fontSize: '11px', opacity: 0.8 }}>© 2024 Copyright: TravelKeet</Typography>
      </Box>
    </Box>
  );
}
