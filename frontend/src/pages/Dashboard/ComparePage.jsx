import { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid2 as Grid, Container, Paper, IconButton, Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import logo from "../../assets/logo.jpeg";
import footerLogo from "../../assets/footer.png";
import truckImage from "../../assets/truckimage.jpeg";

const SECTION_ITEMS = {
  'Bedroom': [
    { label: 'Sleeping Bed (In Built)', photoKey: 'sleepingBedInBuildPhoto', imgKey: 0 },
    { label: 'Sleeping Bed Pop Up', photoKey: 'sleepingBedPopUpPhoto', imgKey: 1 },
    { label: 'Sleeping Sofa', photoKey: 'sleepingSofaPhoto', imgKey: 2 },
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
  'Living Room': [
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

function BrandMark({ size = 32, image = logo }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: '#fff',
        border: '1px solid #e5e7eb',
        p: 0.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box component="img" src={image} alt="TravelKeet" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </Box>
  );
}

function SectionGallery({ title, images = [], onImageClick }) {
  const items = SECTION_ITEMS[title] || [];
  const amenityPhotos = images?.amenityPhotos || {};
  const fallbackImages = images?.galleryImages || [];
  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, textAlign: 'center', minHeight: 32 }}>{title}</Typography>
      <Grid container spacing={2}>
        {items.map((item, i) => {
          const imgSrc = amenityPhotos[item.photoKey] || fallbackImages[item.imgKey] || truckImage;
          return (
            <Grid size={{ xs: 4 }} key={`${title}-${i}`}>
              <Box
                onClick={() => onImageClick && onImageClick(imgSrc)}
                sx={{ borderRadius: 2, overflow: 'hidden', height: 100, mb: 1, cursor: 'pointer', '&:hover': { opacity: 0.85 } }}
              >
                <img src={imgSrc} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
              <Typography sx={{ textAlign: 'center', fontSize: '10px', fontWeight: 700, minHeight: 30 }}>
                {item.label}
              </Typography>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

function CompareDetailColumn({ caravan, onBookNow }) {
  const defaultImage = "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80";
  const [lightboxImage, setLightboxImage] = useState(null);
  const [selectedMainImage, setSelectedMainImage] = useState(null);

  if (!caravan) return null;

  const galleryImages = caravan.details?.displayImages?.length ? caravan.details.displayImages : [defaultImage];
  const mainImg = selectedMainImage || galleryImages[0] || defaultImage;

  return (
    <Box sx={{ px: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
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

      {/* Gallery */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {galleryImages.slice(0, 6).map((image, i) => (
            <Box
              key={`${caravan._id || caravan.details?.vehicleNumber}-${i}`}
              onClick={() => setSelectedMainImage(image)}
              sx={{
                width: 45, height: 35, borderRadius: 1, overflow: 'hidden', cursor: 'pointer',
                border: mainImg === image ? '2px solid #52d88d' : '2px solid transparent',
                transition: 'border 0.15s',
              }}
            >
              <img src={image || defaultImage} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          ))}
        </Box>
        <Box
          onClick={() => setLightboxImage(mainImg)}
          sx={{ flex: 1, borderRadius: 2, overflow: 'hidden', height: 280, cursor: 'pointer', '&:hover': { opacity: 0.9 } }}
        >
          <img src={mainImg} alt="Caravan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
      </Box>

      {/* Price Card */}
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>Price Details:</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>⭐ 4.5 &nbsp; 👥 6</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>₹{caravan.pricing?.pricePerNight || "1,999"}<Typography component="span" sx={{ fontSize: '12px', fontWeight: 400 }}>/per day</Typography></Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
              <BrandMark size={32} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '11px' }}>{caravan.details?.vehicleNumber}</Typography>
            <Typography sx={{ fontSize: '9px', color: '#6b7280' }}>{caravan.details?.vehicleType}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Details List */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, borderBottom: '1px solid #e5e7eb', pb: 1, width: 'fit-content' }}>Caravan Details</Typography>
        <Typography sx={{ textAlign: 'center', fontWeight: 800, mb: 3, fontSize: '13px' }}>Details of Facility In caravan</Typography>
        <Box component="ul" sx={{ pl: 2, fontSize: '12px', color: '#374151', lineHeight: 2 }}>
          <li>Bedroom: Includes in-built sleeping beds, pop-up beds, sleeping sofas, and features like a moonroof/sunroof, fan, and air conditioner.</li>
          <li>Restroom: Comes with essential fixtures like a toilet, shower, and sink for comfortable hygiene.</li>
          <li>Living Room: Equipped with a mobile charging point, sofa seating, and a relaxing ambiance for leisure or socializing.</li>
          <li>Kitchen: Includes basic cooking facilities, such as a stove, refrigerator, and storage for utensils and supplies.</li>
        </Box>
      </Box>

      <SectionGallery title="Bedroom" images={{ amenityPhotos: caravan?.amenityPhotos || {}, galleryImages }} onImageClick={setLightboxImage} />
      <SectionGallery title="Restroom" images={{ amenityPhotos: caravan?.amenityPhotos || {}, galleryImages }} onImageClick={setLightboxImage} />
      <SectionGallery title="Kitchen" images={{ amenityPhotos: caravan?.amenityPhotos || {}, galleryImages }} onImageClick={setLightboxImage} />
      <SectionGallery title="Living Room" images={{ amenityPhotos: caravan?.amenityPhotos || {}, galleryImages }} onImageClick={setLightboxImage} />
      <SectionGallery title="Others" images={{ amenityPhotos: caravan?.amenityPhotos || {}, galleryImages }} onImageClick={setLightboxImage} />

      <Box sx={{ display: 'flex', gap: 2, mt: 'auto', mb: 8 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onBookNow}
          sx={{ bgcolor: '#52d88d', textTransform: 'none', fontWeight: 800, fontSize: '12px' }}
        >
          BOOK NOW
        </Button>
        <Button variant="contained" fullWidth sx={{ bgcolor: '#3b82f6', textTransform: 'none', fontWeight: 800, fontSize: '12px' }}>MESSAGE NOW</Button>
      </Box>
    </Box>
  );
}

function CaravanCardListItem({ caravan, onClick }) {
  const defaultImage = "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=400&q=80";
  return (
    <Paper
      elevation={3}
      onClick={onClick}
      sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: '#fff', mb: 3, cursor: 'pointer', transition: 'transform 0.1s', '&:hover': { transform: 'scale(1.02)' } }}
    >
      <Box sx={{ height: 100, backgroundImage: `url(${caravan.details?.displayImages?.[0] || defaultImage})`, backgroundSize: 'cover' }} />
      <Box sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '11px' }}>{caravan.details?.vehicleNumber || "CE001"}</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '11px' }}>₹{caravan.pricing?.pricePerNight || "1,999"}<Typography component="span" sx={{ fontSize: '9px', color: '#6b7280' }}>/per day</Typography></Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '10px', color: '#4b5563' }}>{caravan.details?.vehicleType || "Classic"} ⭐ 4.5</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1, borderTop: '1px solid #f3f4f6', pt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Typography variant="caption" sx={{ fontSize: '8px' }}>✔ Bathroom</Typography></Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Typography variant="caption" sx={{ fontSize: '8px' }}>✔ Bedroom</Typography></Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><PeopleIcon sx={{ fontSize: 10 }} /><Typography variant="caption" sx={{ fontSize: '8px' }}>6</Typography></Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default function ComparePage({ selectedCaravan, onProceedBooking, onGoHome, onLogout, onAddCaravan }) {
  const [caravans, setCaravans] = useState([]);
  const [comparisonCaravan, setComparisonCaravan] = useState(null);
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
        if (response.ok) setCaravans(data.data);
      } catch (error) { console.error(error); }
    };
    fetchCaravans();
  }, []);

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
              <Avatar sx={{ width: 24, height: 24, bgcolor: '#fff' }}>
                <Box component="img" src={logo} alt="TravelKeet" sx={{ width: 16, height: 16, objectFit: 'contain' }} />
              </Avatar>
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 4 }}>
          <Typography sx={{ fontSize: '10px', color: '#6b7280' }}>Home &gt; Campervan &gt; {selectedCaravan?.details?.vehicleNumber || "CE001"} &gt; Compare</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            {comparisonCaravan && (
              <Button
                size="small"
                onClick={() => setComparisonCaravan(null)}
                sx={{ color: '#ef4444', fontWeight: 700, textTransform: 'none', minHeight: 'auto', p: 0 }}
              >
                Change Comparison
              </Button>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: '2px solid #52d88d', pb: 0.5 }}>
              <Box sx={{ bgcolor: '#52d88d', borderRadius: '50%', p: 0.5, color: '#fff', display: 'flex' }}><LocationOnIcon sx={{ fontSize: 14 }} /></Box>
              <Typography sx={{ fontWeight: 800, fontSize: '13px' }}>Chennai</Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={0} sx={{ borderTop: '1px solid #e5e7eb' }}>
          {/* LEFT COLUMN */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ borderRight: '1px solid #e5e7eb', pt: 4 }}>
            <CompareDetailColumn caravan={selectedCaravan} onBookNow={onProceedBooking} />
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ pt: 4 }}>
            {comparisonCaravan ? (
              <CompareDetailColumn caravan={comparisonCaravan} onBookNow={onProceedBooking} />
            ) : (
              <Box sx={{ px: { md: 10 } }}>
                <Typography sx={{ textAlign: 'center', fontWeight: 800, mb: 5, fontSize: '14px' }}>Top Caravan Available in Chennai</Typography>
                {caravans.filter(c => c._id !== selectedCaravan?._id).map((c) => (
                  <CaravanCardListItem key={c._id} caravan={c} onClick={() => setComparisonCaravan(c)} />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#52d88d', color: '#fff', py: 8, px: { xs: 4, md: 10 }, mt: 0 }}>
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 5 }}>
            <img src={footerLogo} alt="TravelKeet" style={{ height: 46, display: 'block', marginBottom: '16px', objectFit: 'contain' }} />
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
