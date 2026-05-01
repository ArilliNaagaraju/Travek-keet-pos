import { useState } from "react";
import { Box, Typography, Button, Container, Paper, Stepper, Step, StepLabel, Grid, TextField, Avatar, Tabs, Tab, Card, Divider, Chip, CircularProgress } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import logo from "../../assets/logo.jpeg";
import PaymentModal from "../../components/Payment/PaymentModal";

function TopNav({ onGoHome }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
      <img src={logo} alt="TravelKeet" style={{ height: 40 }} />
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
        {['Home', 'About Us', 'Services', 'Packages', 'Contact Us'].map(item => (
          <Typography 
            key={item} 
            variant="body2" 
            onClick={() => item === 'Home' && onGoHome && onGoHome()}
            sx={{ fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#52d88d' } }}
          >
            {item}
          </Typography>
        ))}
      </Box>
      <Avatar sx={{ bgcolor: '#52d88d' }} />
    </Box>
  );
}

function StepperHeader({ activeStep }) {
  const steps = ["Booking Caravan", "Booking CFC", "Personal Details", "Booking Confirmation"];
  return (
    <Box sx={{ width: '100%', mb: 6 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel 
              sx={{ 
                '& .MuiStepLabel-label.Mui-active': { color: '#52d88d', fontWeight: 700 },
                '& .MuiStepIcon-root.Mui-active': { color: '#52d88d' },
                '& .MuiStepIcon-root.Mui-completed': { color: '#52d88d' }
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

function SectionHeader({ title }) {
  return (
    <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', mb: 3, mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 4, height: 24, bgcolor: '#52d88d', borderRadius: 1 }} /> {title}
    </Typography>
  );
}

export default function BookingFlowPage({ caravan, onFinish, onGoHome }) {
  const [stage, setStage] = useState("step1");
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState({
    caravanBooking: { pickupDate: '', dropDate: '', pickupLocation: caravan?.details?.city || '', destination: '', dropLocation: '' },
    nestBooking: { booked: false, checkInDate: '', checkOutDate: '', adults: 0, children: 0 },
    personalDetails: { guestName: '', paxCount: 0, guestAge: 0, aadharNumber: '' }
  });

  const defaultImage = "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80";

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const saveBookingToDb = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?._id) return;

      const cleanPrice = caravan?.pricing?.pricePerNight?.toString().replace(/,/g, '') || "0";
      const total = stage === "step1" ? cleanPrice : (parseInt(cleanPrice) + 5000);

      const payload = {
        caravanId: caravan._id,
        userId: user._id,
        ...formData,
        totalAmount: total,
        status: 'pending'
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStage("thankyou");
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = () => {
    setStage("approved"); // Show the status screen with Pay Now button
  };

  if (stage === "waiting" || stage === "approved") {
    return (
      <>
        <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh', py: 4 }}>
          <Container maxWidth="lg">
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e5e7eb' }}>
              <TopNav onGoHome={onGoHome} />
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>BOOKING STATUS</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>All your travel experience and travel updates at one place.</Typography>
              
              <Tabs value={0} sx={{ mb: 3, '& .MuiTabs-indicator': { bgcolor: '#52d88d' }, '& .MuiTab-root.Mui-selected': { color: '#52d88d' } }}>
                <Tab label="Upcoming" sx={{ fontWeight: 700, textTransform: 'none' }} />
                <Tab label="Cancelled" sx={{ fontWeight: 700, textTransform: 'none' }} />
                <Tab label="Completed" sx={{ fontWeight: 700, textTransform: 'none' }} />
              </Tabs>

              <Card variant="outlined" sx={{ display: 'flex', p: 3, alignItems: 'center', gap: 4, borderRadius: 3 }}>
                <Box sx={{ width: 140, height: 100, borderRadius: 2, overflow: 'hidden' }}>
                  <img src={caravan?.details?.displayImages?.[0] || defaultImage} alt="trip" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>TRAVELKT-{caravan?.details?.vehicleNumber || "23"}</Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>Booking Date: {new Date().toLocaleDateString()}</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Chip size="small" label={formData.caravanBooking.pickupDate || "Feb. 5, 2025"} variant="outlined" />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#52d88d' }}>₹{caravan?.pricing?.pricePerNight || "20,000"}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Button variant="contained" disableElevation sx={{ bgcolor: stage === "waiting" ? '#f59e0b' : '#10b981', fontWeight: 700, borderRadius: 2, textTransform: 'none' }}>
                    {stage === "waiting" ? "Waiting for Approval" : "Approved"}
                  </Button>
                  <Button 
                    variant="contained" 
                    sx={{ bgcolor: '#374151', color: '#fff', fontWeight: 700, borderRadius: 2, textTransform: 'none', '&:hover': { bgcolor: '#1f2937' } }} 
                    onClick={() => {
                      console.log("Opening Payment Modal...");
                      setShowPayment(true);
                    }}
                  >
                    Pay Now
                  </Button>
                </Box>
              </Card>
            </Paper>
          </Container>
        </Box>
        <PaymentModal 
          open={showPayment} 
          onClose={(success) => {
            setShowPayment(false);
            if (success) saveBookingToDb();
          }} 
          amount={caravan?.pricing?.pricePerNight} 
        />
      </>
    );
  }

  if (stage === "thankyou") {
    return (
      <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: 6, borderRadius: 4, border: '1px solid #e5e7eb', textAlign: 'center' }}>
            <TopNav onGoHome={onGoHome} />
            <Box sx={{ mb: 4 }}><CheckCircleIcon sx={{ fontSize: 80, color: '#52d88d' }} /></Box>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>THANK YOU!</Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>For travelling with TravelKeet. Wish you a wonderful trip experience.</Typography>
            <Box sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
              <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=80" alt="thank-you" style={{ width: '100%', height: 300, objectFit: 'cover' }} />
            </Box>
            <Button variant="contained" size="large" sx={{ bgcolor: '#52d88d', px: 6, py: 1.5, borderRadius: 2, fontWeight: 700 }} onClick={onFinish}>GO BACK TO HOME</Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  const activeStepIndex = stage === "step1" ? 0 : stage === "step2" ? 1 : 2;

  return (
    <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: { xs: 2, md: 6 }, borderRadius: 4, border: '1px solid #e5e7eb' }}>
          <TopNav onGoHome={onGoHome} />
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>BOOKING</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>Follow the steps to complete your booking for {caravan?.details?.vehicleNumber}</Typography>
          
          <StepperHeader activeStep={activeStepIndex} />

          {/* Step 1: Caravan Booking */}
          {stage === "step1" && (
            <Box>
              <SectionHeader title="CARAVAN BOOKING" />
              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ borderRadius: 3, overflow: 'hidden', height: 200 }}>
                    <img src={caravan?.details?.displayImages?.[0] || defaultImage} alt="Caravan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{caravan?.details?.vehicleNumber} ({caravan?.details?.vehicleType})</Typography>
                  <Typography variant="body1" sx={{ color: '#52d88d', fontWeight: 700, mb: 3 }}>Rate: ₹{caravan?.pricing?.pricePerNight}/- Per Night</Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}><TextField label="Pickup Date" type="date" value={formData.caravanBooking.pickupDate} onChange={(e) => handleInputChange('caravanBooking', 'pickupDate', e.target.value)} InputLabelProps={{ shrink: true }} fullWidth size="small" /></Grid>
                    <Grid size={{ xs: 6 }}><TextField label="Drop Date" type="date" value={formData.caravanBooking.dropDate} onChange={(e) => handleInputChange('caravanBooking', 'dropDate', e.target.value)} InputLabelProps={{ shrink: true }} fullWidth size="small" /></Grid>
                    <Grid size={{ xs: 12 }}><TextField label="Pickup Location" placeholder="Enter city" value={formData.caravanBooking.pickupLocation} onChange={(e) => handleInputChange('caravanBooking', 'pickupLocation', e.target.value)} fullWidth size="small" /></Grid>
                    <Grid size={{ xs: 6 }}><TextField label="Destination" placeholder="Enter destination" value={formData.caravanBooking.destination} onChange={(e) => handleInputChange('caravanBooking', 'destination', e.target.value)} fullWidth size="small" /></Grid>
                    <Grid size={{ xs: 6 }}><TextField label="Drop Location" placeholder="Enter drop city" value={formData.caravanBooking.dropLocation} onChange={(e) => handleInputChange('caravanBooking', 'dropLocation', e.target.value)} fullWidth size="small" /></Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Step 2: CFC/Nests Booking */}
          {stage === "step2" && (
            <Box>
              <SectionHeader title="TRAVELKEET NESTS (CFC) BOOKING" />
              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ borderRadius: 3, overflow: 'hidden', height: 200 }}>
                    <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80" alt="Nest" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>OOTY HIDDEN VALLEY JUNGLE CAMP</Typography>
                  <Typography variant="body1" sx={{ color: '#52d88d', fontWeight: 700, mb: 3 }}>Rate: ₹ 5,000/- Per Night</Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}><TextField label="Check-in Date" type="date" value={formData.nestBooking.checkInDate} onChange={(e) => handleInputChange('nestBooking', 'checkInDate', e.target.value)} InputLabelProps={{ shrink: true }} fullWidth size="small" /></Grid>
                    <Grid size={{ xs: 6 }}><TextField label="Check-out Date" type="date" value={formData.nestBooking.checkOutDate} onChange={(e) => handleInputChange('nestBooking', 'checkOutDate', e.target.value)} InputLabelProps={{ shrink: true }} fullWidth size="small" /></Grid>
                    <Grid size={{ xs: 6 }}><TextField label="Adults" type="number" value={formData.nestBooking.adults} onChange={(e) => handleInputChange('nestBooking', 'adults', e.target.value)} fullWidth size="small" /></Grid>
                    <Grid size={{ xs: 6 }}><TextField label="Children" type="number" value={formData.nestBooking.children} onChange={(e) => handleInputChange('nestBooking', 'children', e.target.value)} fullWidth size="small" /></Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Step 3: Personal Details */}
          {stage === "step3" && (
            <Box>
              <SectionHeader title="PERSONAL DETAILS" />
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}><TextField label="Name of Primary Guest" value={formData.personalDetails.guestName} onChange={(e) => handleInputChange('personalDetails', 'guestName', e.target.value)} fullWidth /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><TextField label="Number of Pax" type="number" value={formData.personalDetails.paxCount} onChange={(e) => handleInputChange('personalDetails', 'paxCount', e.target.value)} fullWidth /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><TextField label="Age of Guest" type="number" value={formData.personalDetails.guestAge} onChange={(e) => handleInputChange('personalDetails', 'guestAge', e.target.value)} fullWidth /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><TextField label="Aadhar Number" value={formData.personalDetails.aadharNumber} onChange={(e) => handleInputChange('personalDetails', 'aadharNumber', e.target.value)} fullWidth /></Grid>
              </Grid>
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ color: '#6b7280', fontSize: '14px' }}>ESTIMATED TOTAL</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#52d88d' }}>
                ₹ {stage === "step1" ? caravan?.pricing?.pricePerNight : (parseInt(caravan?.pricing?.pricePerNight) + 5000) || "25,000"}/-
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {stage === "step2" && (
                <Button variant="outlined" sx={{ borderRadius: 2, color: '#6b7280', borderColor: '#d1d5db', fontWeight: 700 }} onClick={() => {
                  handleInputChange('nestBooking', 'booked', false);
                  setStage("step3");
                }}>
                  SKIP NEST BOOKING
                </Button>
              )}
              <Button 
                variant="contained" 
                size="large" 
                disabled={loading}
                sx={{ bgcolor: '#52d88d', px: 6, borderRadius: 2, fontWeight: 700, '&:hover': { bgcolor: '#4ade80' } }}
                onClick={() => {
                  if (stage === "step1") {
                    handleInputChange('nestBooking', 'booked', true);
                    setStage("step2");
                  }
                  else if (stage === "step2") setStage("step3");
                  else if (stage === "step3") handleConfirmBooking();
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : (stage === "step3" ? "CONFIRM BOOKING" : "CONTINUE")}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      <PaymentModal 
        open={showPayment} 
        onClose={(success) => {
          setShowPayment(false);
          if (success) saveBookingToDb();
        }} 
        amount={stage === "step1" ? caravan?.pricing?.pricePerNight : (parseInt(caravan?.pricing?.pricePerNight?.toString().replace(/,/g, '') || "0") + 5000)} 
      />
    </Box>
  );
}
