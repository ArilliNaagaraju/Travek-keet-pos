import { useState } from 'react';
import { Box, Typography, Button, Grid2 as Grid, Container, Paper, IconButton, Avatar, Alert } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonIcon from '@mui/icons-material/Person';
import logo from "../../assets/logo.jpeg";

const YES_NO = ["Yes or No", "Yes", "No"];

function Pair({ label, placeholder, isSelect = false, options = [], isFile = false, value, onChange, name }) {
  const fieldSx = {
    width: '100%',
    border: '1px solid #79d7ac',
    borderRadius: '6px',
    backgroundColor: '#fff',
    height: '40px',
    padding: '0 12px',
    fontSize: '12px',
    color: '#4b5563',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Typography variant="body2" sx={{ minWidth: { sm: 140, md: 160 }, fontWeight: 500, color: '#1f2937', fontSize: '12px' }}>
          {label}
        </Typography>
        {isFile ? (
          <Box sx={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', border: '1px solid #79d7ac', borderRadius: 1.5, overflow: 'hidden', height: 40, bgcolor: '#fff' }}>
            <Button
              component="label"
              sx={{ bgcolor: '#e2e8f0', color: '#4a5568', borderRadius: 0, height: '100%', px: 2, textTransform: 'none', minWidth: 'auto', fontSize: '11px', '&:hover': { bgcolor: '#cbd5e1' } }}
            >
              Choose File
              <input type="file" hidden onChange={(e) => onChange(name, e.target.files[0])} />
            </Button>
            <Typography variant="caption" sx={{ color: '#a0aec0', px: 2, fontSize: '11px' }}>
              {value ? value.name : "No file choose"}
            </Typography>
          </Box>
        ) : (
          isSelect ? (
            <Box
              component="select"
              value={value || options[0]?.value || options[0] || ""}
              onChange={(e) => onChange(name, e.target.value)}
              sx={fieldSx}
            >
              {options.map((opt) => {
                const optionValue = opt.value || opt;
                const optionLabel = opt.label || opt;
                return (
                  <option key={optionValue} value={optionValue}>
                    {optionLabel}
                  </option>
                );
              })}
            </Box>
          ) : (
            <Box
              component="input"
              placeholder={placeholder}
              value={value || ""}
              onChange={(e) => onChange(name, e.target.value)}
              sx={fieldSx}
            />
          )
        )}
      </Box>
    </Grid>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <Box sx={{ textAlign: 'center', mb: 3, mt: 4 }}>
      <Typography sx={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 600, color: '#1f2937', mb: 0.5 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default function AddCaravanPage({ onCancel, onSubmit }) {
  const [formData, setFormData] = useState({
    // Details
    vehicleType: 'Classic',
    sleepingCapacity: 'Select no of sleeping area',
    vehicleNumber: '',
    displayImages: null,
    registrationDetails: null,
    state: 'Select State',
    seatingCapacity: 'Select number of seat',
    city: 'Select City',
    seatingImages: null,
    description: '',
    
    // Bedroom
    sleepingBedInBuild: 'Yes or No',
    moonRoof: 'Yes or No',
    sleepingBedPopUp: 'Yes or No',
    fan: 'Yes or No',
    sleepingSofa: 'Yes or No',
    airConditioner: 'Yes or No',
    mobileCharging: 'Yes or No',
    
    // Bathroom
    bathroom: 'Yes or No',
    freshWaterTank: 'Yes or No',
    geyser: 'Yes or No',
    freshWater: '',
    wasteWaterDisposal: 'Yes or No',
    greyWater: '',
    
    // Kitchen
    microwave: 'Yes or No',
    refrigerator: 'Yes or No',
    kitchenInside: 'Yes or No',
    kitchenExternal: 'Yes or No',
    
    // Living Room
    entertainmentSystem: 'Yes or No',
    dinnerTable: 'Yes or No',
    television: 'Yes or No',
    coupleFriendly: 'Yes or No',
    petFriendly: 'Yes or No',
    
    // Other
    wifi: 'Yes or No',
    batteryInverter: 'Yes or No',
    securityCamera: 'Yes or No',
    ironBox: 'Yes or No',
    parkingAssist: 'Yes or No',
    solarPanel: 'Yes or No',
    campingTent: 'Yes or No',
    campingAccessories: 'Yes or No',
    chautterDriver: 'Yes or No',
    awning: 'Yes or No',
    
    // Pricing
    fixedKms: 'Yes or No',
    pricePerNight: '',
    extraKmsRate: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const providerId = localStorage.getItem('providerId');
    if (!providerId) {
      setError('Provider ID not found. Please register first.');
      setLoading(false);
      return;
    }

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const payload = {
      providerId,
      userId: user ? user._id : null,
      details: {
        vehicleType: formData.vehicleType,
        sleepingCapacity: formData.sleepingCapacity,
        vehicleNumber: formData.vehicleNumber,
        displayImages: [],
        registrationDetails: [],
        state: formData.state,
        seatingCapacity: formData.seatingCapacity,
        city: formData.city,
        seatingImages: [],
        description: formData.description
      },
      amenities: {
        bedroom: {
          sleepingBedInBuild: formData.sleepingBedInBuild,
          moonRoof: formData.moonRoof,
          sleepingBedPopUp: formData.sleepingBedPopUp,
          fan: formData.fan,
          sleepingSofa: formData.sleepingSofa,
          airConditioner: formData.airConditioner,
          mobileCharging: formData.mobileCharging
        },
        bathroom: {
          bathroom: formData.bathroom,
          freshWaterTank: formData.freshWaterTank,
          geyser: formData.geyser,
          freshWater: formData.freshWater,
          wasteWaterDisposal: formData.wasteWaterDisposal,
          greyWater: formData.greyWater
        },
        kitchen: {
          microwave: formData.microwave,
          refrigerator: formData.refrigerator,
          kitchenInside: formData.kitchenInside,
          kitchenExternal: formData.kitchenExternal
        },
        livingRoom: {
          entertainmentSystem: formData.entertainmentSystem,
          dinnerTable: formData.dinnerTable,
          television: formData.television,
          coupleFriendly: formData.coupleFriendly,
          petFriendly: formData.petFriendly
        },
        other: {
          wifi: formData.wifi,
          batteryInverter: formData.batteryInverter,
          securityCamera: formData.securityCamera,
          ironBox: formData.ironBox,
          parkingAssist: formData.parkingAssist,
          solarPanel: formData.solarPanel,
          campingTent: formData.campingTent,
          campingAccessories: formData.campingAccessories,
          chautterDriver: formData.chautterDriver,
          awning: formData.awning
        }
      },
      pricing: {
        fixedKms: formData.fixedKms,
        pricePerNight: formData.pricePerNight,
        extraKmsRate: formData.extraKmsRate
      }
    };

    try {
      const submitData = new FormData();
      submitData.append('payload', JSON.stringify(payload));
      if (formData.displayImages) submitData.append('displayImages', formData.displayImages);
      if (formData.registrationDetails) submitData.append('registrationDetails', formData.registrationDetails);
      if (formData.seatingImages) submitData.append('seatingImages', formData.seatingImages);

      const response = await fetch('http://localhost:5000/api/caravans', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        alert('Caravan Added Successfully!');
        onSubmit && onSubmit();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add caravan');
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
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: '#fff', pb: 8 }}>
          
          <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <img src={logo} alt="TravelKeet" style={{ height: 50 }} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton sx={{ color: '#34c37d' }}><NotificationsNoneIcon /></IconButton>
              <Avatar sx={{ bgcolor: '#34c37d', width: 32, height: 32 }}><PersonIcon fontSize="small" /></Avatar>
            </Box>
          </Box>

          <Typography sx={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontSize: '26px', color: '#111827', mb: 6 }}>
            Add Caravan
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3, mx: 8 }}>{error}</Alert>}

          <Box sx={{ px: { xs: 3, md: 8 } }}>
            <Typography sx={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 600, color: '#1f2937', mb: 3 }}>
              Caravan Details
            </Typography>
            
            <Grid container columnSpacing={6} rowSpacing={3} sx={{ mb: 6 }}>
              <Pair label="Vehicle Type" isSelect options={["Classic"]} name="vehicleType" value={formData.vehicleType} onChange={handleChange} />
              <Pair label="Sleeping Capacity" isSelect options={["Select no of sleeping area", "2", "4"]} name="sleepingCapacity" value={formData.sleepingCapacity} onChange={handleChange} />
              <Pair label="Vehicle Number" placeholder="Enter Vehicle Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} />
              <Pair label="Display images" isFile={true} name="displayImages" value={formData.displayImages} onChange={handleChange} />
              <Pair label="Registration Details" isFile={true} name="registrationDetails" value={formData.registrationDetails} onChange={handleChange} />
              <Pair label="State" isSelect options={["Select State", "Tamil Nadu", "Karnataka"]} name="state" value={formData.state} onChange={handleChange} />
              <Pair label="Seating Capacity" isSelect options={["Select number of seat", "2", "4", "6"]} name="seatingCapacity" value={formData.seatingCapacity} onChange={handleChange} />
              <Pair label="City" isSelect options={["Select City", "Chennai", "Bangalore"]} name="city" value={formData.city} onChange={handleChange} />
              <Pair label="Seating images" isFile={true} name="seatingImages" value={formData.seatingImages} onChange={handleChange} />
            </Grid>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 6 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: 600, color: '#374151', mb: 1 }}>
                  CAMPERVAN / DESCRIPTION FOR THE CAMPER
                </Typography>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', lineHeight: 1.6 }}>
                  Give detailed description about the Campervan like facilities available for the user showing purposes etc.
                </Typography>
              </Box>
              <Box sx={{ flex: 1.5 }}>
                <Box
                  component="textarea"
                  rows={4}
                  placeholder="Enter Details...."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  sx={{
                    width: '100%',
                    border: '1px solid #79d7ac',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '12px',
                    color: '#1f2937',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </Box>
            </Box>

            <Typography sx={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 600, color: '#111827', mb: 2 }}>
              Extra Amenities
            </Typography>

            <SectionTitle title="Bedroom" subtitle="Upload the photo of the amenities" />
            <Grid container columnSpacing={6} rowSpacing={2.5}>
              <Pair label="Sleeping bed (in build)" isSelect options={YES_NO} name="sleepingBedInBuild" value={formData.sleepingBedInBuild} onChange={handleChange} />
              <Pair label="Moon roof/ sun roof" isSelect options={YES_NO} name="moonRoof" value={formData.moonRoof} onChange={handleChange} />
              <Pair label="sleeping bed pop up" isSelect options={YES_NO} name="sleepingBedPopUp" value={formData.sleepingBedPopUp} onChange={handleChange} />
              <Pair label="Fan" isSelect options={YES_NO} name="fan" value={formData.fan} onChange={handleChange} />
              <Pair label="Sleeping sofa" isSelect options={YES_NO} name="sleepingSofa" value={formData.sleepingSofa} onChange={handleChange} />
              <Pair label="Air Conditioner" isSelect options={YES_NO} name="airConditioner" value={formData.airConditioner} onChange={handleChange} />
              <Pair label="Mobile charging point" isSelect options={YES_NO} name="mobileCharging" value={formData.mobileCharging} onChange={handleChange} />
            </Grid>

            <SectionTitle title="Bathroom" subtitle="Upload the photo of the amenities" />
            <Grid container columnSpacing={6} rowSpacing={2.5}>
              <Pair label="Bathroom" isSelect options={YES_NO} name="bathroom" value={formData.bathroom} onChange={handleChange} />
              <Pair label="Fresh water Tank" isSelect options={YES_NO} name="freshWaterTank" value={formData.freshWaterTank} onChange={handleChange} />
              <Pair label="Geyser" isSelect options={YES_NO} name="geyser" value={formData.geyser} onChange={handleChange} />
              <Pair label="Fresh water" name="freshWater" value={formData.freshWater} onChange={handleChange} />
              <Pair label="Waste Water disposal" isSelect options={YES_NO} name="wasteWaterDisposal" value={formData.wasteWaterDisposal} onChange={handleChange} />
              <Pair label="Grey Water" name="greyWater" value={formData.greyWater} onChange={handleChange} />
            </Grid>

            <SectionTitle title="kitchen" subtitle="Upload the photo of the amenities" />
            <Grid container columnSpacing={6} rowSpacing={2.5}>
              <Pair label="Micro wave" isSelect options={YES_NO} name="microwave" value={formData.microwave} onChange={handleChange} />
              <Pair label="Refrigerator" isSelect options={YES_NO} name="refrigerator" value={formData.refrigerator} onChange={handleChange} />
              <Pair label="Kitchen(inside)" isSelect options={YES_NO} name="kitchenInside" value={formData.kitchenInside} onChange={handleChange} />
              <Pair label="Kitchen(external)" isSelect options={YES_NO} name="kitchenExternal" value={formData.kitchenExternal} onChange={handleChange} />
            </Grid>

            <SectionTitle title="Living Room" subtitle="Upload the photo of the amenities" />
            <Grid container columnSpacing={6} rowSpacing={2.5}>
              <Pair label="Entertainment system" isSelect options={YES_NO} name="entertainmentSystem" value={formData.entertainmentSystem} onChange={handleChange} />
              <Pair label="Dinner Table" isSelect options={YES_NO} name="dinnerTable" value={formData.dinnerTable} onChange={handleChange} />
              <Pair label="Television" isSelect options={YES_NO} name="television" value={formData.television} onChange={handleChange} />
              <Pair label="Couple Friendly" isSelect options={YES_NO} name="coupleFriendly" value={formData.coupleFriendly} onChange={handleChange} />
              <Pair label="Pet Friendly" isSelect options={YES_NO} name="petFriendly" value={formData.petFriendly} onChange={handleChange} />
            </Grid>

            <SectionTitle title="Other facilities" subtitle="Upload the photo of the amenities" />
            <Grid container columnSpacing={6} rowSpacing={2.5}>
              <Pair label="Wifi" isSelect options={YES_NO} name="wifi" value={formData.wifi} onChange={handleChange} />
              <Pair label="Battery & Inverter" isSelect options={YES_NO} name="batteryInverter" value={formData.batteryInverter} onChange={handleChange} />
              <Pair label="Security Camera" isSelect options={YES_NO} name="securityCamera" value={formData.securityCamera} onChange={handleChange} />
              <Pair label="Iron Box" isSelect options={YES_NO} name="ironBox" value={formData.ironBox} onChange={handleChange} />
              <Pair label="Parking assist" isSelect options={YES_NO} name="parkingAssist" value={formData.parkingAssist} onChange={handleChange} />
              <Pair label="Solar Panel" isSelect options={YES_NO} name="solarPanel" value={formData.solarPanel} onChange={handleChange} />
              <Pair label="Camping Tent" isSelect options={YES_NO} name="campingTent" value={formData.campingTent} onChange={handleChange} />
              <Pair label="Camping Accessories" isSelect options={YES_NO} name="campingAccessories" value={formData.campingAccessories} onChange={handleChange} />
              <Pair label="Chautter Driver" isSelect options={YES_NO} name="chautterDriver" value={formData.chautterDriver} onChange={handleChange} />
              <Pair label="Awning" isSelect options={YES_NO} name="awning" value={formData.awning} onChange={handleChange} />
            </Grid>

            <Typography sx={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 600, color: '#1f2937', mt: 6, mb: 3 }}>
              Pricing
            </Typography>
            <Grid container columnSpacing={6} rowSpacing={2.5}>
              <Pair label="Select Fixed Kms" isSelect options={YES_NO} name="fixedKms" value={formData.fixedKms} onChange={handleChange} />
              <Pair label="price per night" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} />
              <Pair label="Extra Kms. Rate" name="extraKmsRate" value={formData.extraKmsRate} onChange={handleChange} />
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 8 }}>
              <Button 
                variant="outlined" 
                onClick={onCancel} 
                disabled={loading}
                sx={{ 
                  width: 140, 
                  borderRadius: 8, 
                  color: '#000', 
                  borderColor: '#ef4444', 
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  '&:hover': { borderColor: '#dc2626', bgcolor: '#fef2f2' }
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
                  width: 140, 
                  borderRadius: 8, 
                  bgcolor: '#52d88d', 
                  color: '#000',
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
        </Paper>
      </Container>
    </Box>
  );
}
