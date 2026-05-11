import { useState } from "react";
import { Box, Typography, Button, Container, Paper, Stepper, Step, StepLabel, Grid2 as Grid, TextField, Avatar, Tabs, Tab, Card, Divider, Chip, CircularProgress, Popover, IconButton } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
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

function formatISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(value) {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  return `${d}-${m}-${y}`;
}

function parseISODate(value) {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function CalendarInput({ label, value, onChange }) {
  const selectedDate = parseISODate(value);
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewDate, setViewDate] = useState(selectedDate || new Date());
  const open = Boolean(anchorEl);

  const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const endOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  const startWeekDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const prevMonthDays = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();
  const cells = [];

  for (let i = startWeekDay - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  while (cells.length < 42) cells.push({ day: cells.length - (startWeekDay + daysInMonth) + 1, current: false });

  const monthLabel = viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const weekLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  return (
    <>
      <TextField
        label={label}
        value={formatDisplayDate(value)}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        placeholder="dd-mm-yyyy"
        fullWidth
        size="small"
        InputLabelProps={{ shrink: true }}
        inputProps={{ readOnly: true }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ width: 320, bgcolor: '#e9eaf2', borderRadius: 2.5, overflow: 'hidden', boxShadow: '0 10px 30px rgba(15,23,42,0.14)', border: '1px solid #dde1eb' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2.5, pt: 2, pb: 1.5 }}>
            <Typography sx={{ fontSize: '24px', fontWeight: 800, color: '#222937', lineHeight: 1.1, letterSpacing: 0.2 }}>{monthLabel}</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} sx={{ bgcolor: '#2a7f5c', color: '#fff', borderRadius: 1.2, width: 32, height: 30, '&:hover': { bgcolor: '#236b4d' } }}>
                <KeyboardArrowLeftIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} sx={{ bgcolor: '#2a7f5c', color: '#fff', borderRadius: 1.2, width: 32, height: 30, '&:hover': { bgcolor: '#236b4d' } }}>
                <KeyboardArrowRightIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ borderTop: '1px solid #d8dde8', px: 2, pt: 1.2, pb: 1.2 }}>
            <Grid container columns={7} sx={{ mb: 0.5 }}>
              {weekLabels.map((w) => (
                <Grid key={w} size={1}>
                  <Typography sx={{ textAlign: 'center', fontSize: '13px', fontWeight: 700, color: '#2a3140', lineHeight: 1.2 }}>{w}</Typography>
                </Grid>
              ))}
            </Grid>
            <Grid container columns={7} rowSpacing={0.6}>
              {cells.map((cell, idx) => {
                const monthDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), cell.current ? cell.day : (idx < startWeekDay ? cell.day - prevMonthDays : daysInMonth + cell.day));
                const isSelected = selectedDate && formatISODate(monthDate) === formatISODate(selectedDate);
                return (
                  <Grid key={`${cell.day}-${idx}`} size={1}>
                    <Box
                      onClick={() => {
                        if (!cell.current) return;
                        onChange(formatISODate(monthDate));
                        setAnchorEl(null);
                      }}
                      sx={{
                        width: 36,
                        height: 36,
                        mx: 'auto',
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '15px',
                        fontWeight: isSelected ? 700 : 500,
                        color: cell.current ? '#3a4253' : '#9ea7b8',
                        bgcolor: isSelected ? '#2a7f5c' : 'transparent',
                        color: isSelected ? '#fff' : (cell.current ? '#3a4253' : '#9ea7b8'),
                        cursor: cell.current ? 'pointer' : 'default',
                        '&:hover': {
                          bgcolor: cell.current && !isSelected ? '#dfe3ef' : undefined,
                        },
                      }}
                    >
                      {cell.day}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>
      </Popover>
    </>
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

  // Calculate number of nights between pickup and drop date
  const getNights = () => {
    const { pickupDate, dropDate } = formData.caravanBooking;
    if (!pickupDate || !dropDate) return 0;
    const start = new Date(pickupDate);
    const end = new Date(dropDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const getPricePerNight = () =>
    parseFloat((caravan?.pricing?.pricePerNight || "0").toString().replace(/,/g, '')) || 0;

  const getCaravanTotal = () => {
    const nights = getNights();
    const ppn = getPricePerNight();
    return nights > 0 ? nights * ppn : ppn;
  };

  const getGrandTotal = () =>
    formData.nestBooking.booked
      ? getCaravanTotal() + 5000
      : getCaravanTotal();

  const saveBookingToDb = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?._id) return;

      const total = getGrandTotal();

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
                {/* Caravan image */}
                <Box sx={{ width: 140, height: 100, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                  <img
                    src={caravan?.details?.displayImages?.[0] || defaultImage}
                    alt="Caravan"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = defaultImage; }}
                  />
                </Box>

                {/* Booking info */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    TRAVELKT-{caravan?.details?.vehicleNumber || "23"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', mb: 1.5 }}>
                    Booking Date: {new Date().toLocaleDateString()}
                  </Typography>

                  {/* Date range chips */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Chip size="small" label={formData.caravanBooking.pickupDate || "Start date"} variant="outlined" />
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>→</Typography>
                    <Chip size="small" label={formData.caravanBooking.dropDate || "End date"} variant="outlined" />
                    {getNights() > 0 && (
                      <Chip size="small" label={`${getNights()} night${getNights() > 1 ? 's' : ''}`} sx={{ bgcolor: '#f0fdf4', color: '#15803d', fontWeight: 700 }} />
                    )}
                  </Box>

                  {/* Personal Details */}
                  {formData.personalDetails.guestName && (
                    <Typography variant="caption" sx={{ color: '#4b5563', display: 'block', mb: 0.5 }}>
                      Guest: <strong>{formData.personalDetails.guestName}</strong>
                      {formData.personalDetails.paxCount > 0 && ` | Pax: ${formData.personalDetails.paxCount}`}
                      {formData.personalDetails.guestAge > 0 && ` | Age: ${formData.personalDetails.guestAge}`}
                      {formData.personalDetails.aadharNumber && ` | Aadhar: ${formData.personalDetails.aadharNumber}`}
                    </Typography>
                  )}

                  {/* Price breakdown */}
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#52d88d' }}>
                      ₹{getGrandTotal().toLocaleString('en-IN')}
                    </Typography>
                    {getNights() > 0 && (
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        ({getNights()} × ₹{getPricePerNight().toLocaleString('en-IN')}{formData.nestBooking.booked ? ' + ₹5,000 Nest' : ''})
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Action buttons */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexShrink: 0 }}>
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{ bgcolor: stage === "waiting" ? '#f59e0b' : '#10b981', fontWeight: 700, borderRadius: 2, textTransform: 'none', minWidth: 140 }}
                  >
                    {stage === "waiting" ? "Waiting for Approval" : "Approved"}
                  </Button>
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{ bgcolor: '#374151', color: '#fff', fontWeight: 700, borderRadius: 2, textTransform: 'none', minWidth: 140, '&:hover': { bgcolor: '#1f2937' } }}
                    onClick={() => setShowPayment(true)}
                  >
                    Pay Now — ₹{getGrandTotal().toLocaleString('en-IN')}
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
          amount={getGrandTotal()}
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

          {/* Booking Hero Banner */}
          <Box
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              mb: 5,
              background: 'linear-gradient(120deg, #2e3e52 0%, #34c37d 100%)',
              position: 'relative',
              minHeight: 100,
              display: 'flex',
              alignItems: 'center',
              px: { xs: 3, md: 5 },
              py: 3,
            }}
          >
            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.18)', borderRadius: 3 }} />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="overline"
                sx={{ color: 'rgba(255,255,255,0.75)', letterSpacing: 4, fontSize: '11px', display: 'block', mb: 0.5 }}
              >
                BOOKING
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff', lineHeight: 1.2, mb: 0.5 }}>
                Complete Your Booking
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5 }}>
                Follow the steps to book &nbsp;
                <Box component="span" sx={{ fontWeight: 800, bgcolor: 'rgba(255,255,255,0.2)', px: 1.5, py: 0.3, borderRadius: 8 }}>
                  {caravan?.details?.vehicleNumber || "your caravan"}
                </Box>
              </Typography>
            </Box>
          </Box>

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
                    <Grid size={{ xs: 6 }}><CalendarInput label="Pickup Date" value={formData.caravanBooking.pickupDate} onChange={(val) => handleInputChange('caravanBooking', 'pickupDate', val)} /></Grid>
                    <Grid size={{ xs: 6 }}><CalendarInput label="Drop Date" value={formData.caravanBooking.dropDate} onChange={(val) => handleInputChange('caravanBooking', 'dropDate', val)} /></Grid>
                    <Grid size={{ xs: 4 }}><TextField label="Pickup Location" placeholder="Enter city" value={formData.caravanBooking.pickupLocation} onChange={(e) => handleInputChange('caravanBooking', 'pickupLocation', e.target.value)} fullWidth size="small" /></Grid>
                    <Grid size={{ xs: 4 }}><TextField label="Destination" placeholder="Enter destination" value={formData.caravanBooking.destination} onChange={(e) => handleInputChange('caravanBooking', 'destination', e.target.value)} fullWidth size="small" /></Grid>
                    <Grid size={{ xs: 4 }}><TextField label="Drop Location" placeholder="Enter drop city" value={formData.caravanBooking.dropLocation} onChange={(e) => handleInputChange('caravanBooking', 'dropLocation', e.target.value)} fullWidth size="small" /></Grid>
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
                    <Grid size={{ xs: 6 }}><CalendarInput label="Check-in Date" value={formData.nestBooking.checkInDate} onChange={(val) => handleInputChange('nestBooking', 'checkInDate', val)} /></Grid>
                    <Grid size={{ xs: 6 }}><CalendarInput label="Check-out Date" value={formData.nestBooking.checkOutDate} onChange={(val) => handleInputChange('nestBooking', 'checkOutDate', val)} /></Grid>
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
              {/* Breakdown line */}
              {getNights() > 0 ? (
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.5 }}>
                  {getNights()} night{getNights() > 1 ? 's' : ''} × ₹{getPricePerNight().toLocaleString('en-IN')}
                  {formData.nestBooking.booked && ' + ₹5,000 (Nest)'}
                </Typography>
              ) : (
                <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 0.5 }}>
                  Select pickup & drop dates to see total
                </Typography>
              )}
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#52d88d' }}>
                ₹{getGrandTotal().toLocaleString('en-IN')}/-
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
          amount={getGrandTotal()}
        />
      </Box>
  );
}
