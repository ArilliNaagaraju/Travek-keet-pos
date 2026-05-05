import { useState } from 'react';
import { Box, Typography, Button, Grid2 as Grid, Container, Paper, IconButton, Avatar, Alert } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import logo from "../../assets/logo.jpeg";

const YES_NO = ["Yes or No", "Yes", "No"];
const PLACEHOLDER_VALUES = new Set([
  'Yes or No', 'Select no of sleeping area', 'Select number of seat',
  'Select State', 'Select City', 'Select...',
]);

/* ── Generic field pair ───────────────────────────────────────── */
function Pair({ label, placeholder, isSelect = false, options = [], isFile = false, multiple = false, value, onChange, name }) {
  const isFilled = isFile
    ? (multiple ? (value && value.length > 0) : !!value)
    : isSelect
      ? !!value && !PLACEHOLDER_VALUES.has(value) && options.length > 1
      : !!(value && String(value).trim());

  const baseSx = {
    width: '100%',
    border: isFilled ? '1.5px solid #34c37d' : '1px solid #79d7ac',
    borderRadius: '6px',
    backgroundColor: '#fff',
    height: '40px',
    fontSize: '12px',
    color: '#4b5563',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };
  const fieldSx = { ...baseSx, padding: '0 36px 0 12px' };

  const fileLabel = multiple
    ? (value && value.length > 0 ? `${value.length} file(s) selected` : 'No files chosen')
    : (value ? value.name : 'No file chosen');

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Typography variant="body2" sx={{ minWidth: { sm: 140, md: 160 }, fontWeight: 500, color: '#1f2937', fontSize: '12px' }}>
          {label}
        </Typography>

        {isFile ? (
          <Box sx={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', border: isFilled ? '1.5px solid #34c37d' : '1px solid #79d7ac', borderRadius: 1.5, overflow: 'hidden', height: 40, bgcolor: '#fff', transition: 'border-color 0.2s' }}>
            <Button
              component="label"
              sx={{ bgcolor: '#e2e8f0', color: '#4a5568', borderRadius: 0, height: '100%', px: 2, textTransform: 'none', minWidth: 'auto', fontSize: '11px', '&:hover': { bgcolor: '#cbd5e1' } }}
            >
              {multiple ? 'Choose Files' : 'Choose File'}
              <input
                type="file"
                hidden
                multiple={multiple}
                accept="image/*"
                onChange={(e) => onChange(name, multiple ? Array.from(e.target.files) : e.target.files[0])}
              />
            </Button>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5 }}>
              <Typography variant="caption" sx={{ color: isFilled ? '#1f2937' : '#a0aec0', fontSize: '11px' }}>
                {fileLabel}
              </Typography>
              {isFilled && <CheckCircleOutlineIcon sx={{ color: '#34c37d', fontSize: 16 }} />}
            </Box>
          </Box>
        ) : (
          <Box sx={{ flex: 1, width: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}>
            {isSelect ? (
              <Box component="select" value={value || options[0]?.value || options[0] || ""} onChange={(e) => onChange(name, e.target.value)} sx={fieldSx}>
                {options.map((opt) => {
                  const v = opt.value || opt;
                  return <option key={v} value={v}>{opt.label || opt}</option>;
                })}
              </Box>
            ) : (
              <Box component="input" placeholder={placeholder} value={value || ""} onChange={(e) => onChange(name, e.target.value)} sx={fieldSx} />
            )}
            {isFilled && (
              <CheckCircleOutlineIcon sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#34c37d', fontSize: 17, pointerEvents: 'none' }} />
            )}
          </Box>
        )}
      </Box>
    </Grid>
  );
}

/* ── Amenity pair: Yes/No + conditional photo upload ──────────── */
function AmenityPair({ label, name, value, onChange, imageValue, onImageChange }) {
  const isFilled = value === 'Yes' || value === 'No';
  const isYes = value === 'Yes';
  const hasImage = isYes && !!imageValue;

  const selectSx = {
    width: '100%',
    border: isFilled ? '1.5px solid #34c37d' : '1px solid #79d7ac',
    borderRadius: '6px',
    backgroundColor: '#fff',
    height: '40px',
    fontSize: '12px',
    color: '#4b5563',
    outline: 'none',
    boxSizing: 'border-box',
    padding: '0 36px 0 12px',
    transition: 'border-color 0.2s',
  };

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      {/* Select row */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Typography variant="body2" sx={{ minWidth: { sm: 140, md: 160 }, fontWeight: 500, color: '#1f2937', fontSize: '12px' }}>
          {label}
        </Typography>
        <Box sx={{ flex: 1, width: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Box component="select" value={value} onChange={(e) => onChange(name, e.target.value)} sx={selectSx}>
            {YES_NO.map(o => <option key={o} value={o}>{o}</option>)}
          </Box>
          {isFilled && (
            <CheckCircleOutlineIcon sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#34c37d', fontSize: 17, pointerEvents: 'none' }} />
          )}
        </Box>
      </Box>

      {/* Upload row — shown only when Yes */}
      {isYes && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5, pl: { sm: '172px' } }}>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              border: hasImage ? '1.5px solid #34c37d' : '1px dashed #79d7ac',
              borderRadius: 1.5,
              overflow: 'hidden',
              height: 36,
              bgcolor: hasImage ? '#f0fdf4' : '#fafafa',
              transition: 'all 0.2s',
            }}
          >
            <Button
              component="label"
              sx={{ bgcolor: '#34c37d', color: '#fff', borderRadius: 0, height: '100%', px: 1.5, textTransform: 'none', minWidth: 'auto', fontSize: '10px', gap: 0.5, '&:hover': { bgcolor: '#2db86a' } }}
            >
              <CloudUploadIcon sx={{ fontSize: 14 }} /> Upload Photo
              <input type="file" hidden accept="image/*" onChange={(e) => onImageChange(name + 'Photo', e.target.files[0])} />
            </Button>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1 }}>
              <Typography variant="caption" sx={{ fontSize: '10px', color: hasImage ? '#1f2937' : '#a0aec0' }}>
                {imageValue ? imageValue.name : 'Upload photo for this amenity'}
              </Typography>
              {hasImage && <CheckCircleOutlineIcon sx={{ color: '#34c37d', fontSize: 14 }} />}
            </Box>
          </Box>
        </Box>
      )}
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
    vehicleType: 'Classic',
    sleepingCapacity: 'Select no of sleeping area',
    vehicleNumber: '',
    displayImages: [],       // multiple images
    registrationDetails: null,
    state: 'Select State',
    seatingCapacity: 'Select number of seat',
    city: 'Select City',
    seatingImages: null,
    description: '',
    // Bedroom
    sleepingBedInBuild: 'Yes or No', moonRoof: 'Yes or No', sleepingBedPopUp: 'Yes or No',
    fan: 'Yes or No', sleepingSofa: 'Yes or No', airConditioner: 'Yes or No', mobileCharging: 'Yes or No',
    // Bathroom
    bathroom: 'Yes or No', freshWaterTank: 'Yes or No', geyser: 'Yes or No',
    freshWater: '', wasteWaterDisposal: 'Yes or No', greyWater: '',
    // Kitchen
    microwave: 'Yes or No', refrigerator: 'Yes or No', kitchenInside: 'Yes or No', kitchenExternal: 'Yes or No',
    // Living Room
    entertainmentSystem: 'Yes or No', dinnerTable: 'Yes or No', television: 'Yes or No',
    coupleFriendly: 'Yes or No', petFriendly: 'Yes or No',
    // Other
    wifi: 'Yes or No', batteryInverter: 'Yes or No', securityCamera: 'Yes or No', ironBox: 'Yes or No',
    parkingAssist: 'Yes or No', solarPanel: 'Yes or No', campingTent: 'Yes or No',
    campingAccessories: 'Yes or No', chautterDriver: 'Yes or No', awning: 'Yes or No',
    // Pricing
    fixedKms: 'Yes or No', pricePerNight: '', extraKmsRate: '',
  });

  // Amenity photo uploads keyed by amenity name + "Photo"
  const [amenityPhotos, setAmenityPhotos] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
  const handleAmenityPhoto = (key, file) => setAmenityPhotos(prev => ({ ...prev, [key]: file }));

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
        description: formData.description,
      },
      amenities: {
        bedroom: {
          sleepingBedInBuild: formData.sleepingBedInBuild, moonRoof: formData.moonRoof,
          sleepingBedPopUp: formData.sleepingBedPopUp, fan: formData.fan,
          sleepingSofa: formData.sleepingSofa, airConditioner: formData.airConditioner,
          mobileCharging: formData.mobileCharging,
        },
        bathroom: {
          bathroom: formData.bathroom, freshWaterTank: formData.freshWaterTank,
          geyser: formData.geyser, freshWater: formData.freshWater,
          wasteWaterDisposal: formData.wasteWaterDisposal, greyWater: formData.greyWater,
        },
        kitchen: {
          microwave: formData.microwave, refrigerator: formData.refrigerator,
          kitchenInside: formData.kitchenInside, kitchenExternal: formData.kitchenExternal,
        },
        livingRoom: {
          entertainmentSystem: formData.entertainmentSystem, dinnerTable: formData.dinnerTable,
          television: formData.television, coupleFriendly: formData.coupleFriendly,
          petFriendly: formData.petFriendly,
        },
        other: {
          wifi: formData.wifi, batteryInverter: formData.batteryInverter,
          securityCamera: formData.securityCamera, ironBox: formData.ironBox,
          parkingAssist: formData.parkingAssist, solarPanel: formData.solarPanel,
          campingTent: formData.campingTent, campingAccessories: formData.campingAccessories,
          chautterDriver: formData.chautterDriver, awning: formData.awning,
        },
      },
      pricing: {
        fixedKms: formData.fixedKms,
        pricePerNight: formData.pricePerNight,
        extraKmsRate: formData.extraKmsRate,
      },
    };

    try {
      const submitData = new FormData();
      submitData.append('payload', JSON.stringify(payload));

      // Multiple display images
      if (formData.displayImages && formData.displayImages.length > 0) {
        formData.displayImages.forEach(file => submitData.append('displayImages', file));
      }
      if (formData.registrationDetails) submitData.append('registrationDetails', formData.registrationDetails);
      if (formData.seatingImages) submitData.append('seatingImages', formData.seatingImages);

      // Amenity photos (only for Yes-selected amenities)
      Object.entries(amenityPhotos).forEach(([key, file]) => {
        if (file) submitData.append(key, file);
      });

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
            {/* ── Caravan Details ── */}
            <Typography sx={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 600, color: '#1f2937', mb: 3 }}>
              Caravan Details
            </Typography>

            <Grid container columnSpacing={6} rowSpacing={3} sx={{ mb: 6 }}>
              <Pair label="Vehicle Type" isSelect options={["Classic"]} name="vehicleType" value={formData.vehicleType} onChange={handleChange} />
              <Pair label="Sleeping Capacity" isSelect options={["Select no of sleeping area", "2", "4"]} name="sleepingCapacity" value={formData.sleepingCapacity} onChange={handleChange} />
              <Pair label="Vehicle Number" placeholder="Enter Vehicle Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} />

              {/* Multiple display images */}
              <Pair label="Display Images" isFile multiple name="displayImages" value={formData.displayImages} onChange={handleChange} />

              <Pair label="Registration Details" isFile name="registrationDetails" value={formData.registrationDetails} onChange={handleChange} />
              <Pair label="State" isSelect options={["Select State", "Tamil Nadu", "Karnataka"]} name="state" value={formData.state} onChange={handleChange} />
              <Pair label="Seating Capacity" isSelect options={["Select number of seat", "2", "4", "6"]} name="seatingCapacity" value={formData.seatingCapacity} onChange={handleChange} />
              <Pair label="City" isSelect options={["Select City", "Chennai", "Bangalore"]} name="city" value={formData.city} onChange={handleChange} />
              <Pair label="Seating Images" isFile name="seatingImages" value={formData.seatingImages} onChange={handleChange} />
            </Grid>

            {/* Description */}
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
                  sx={{ width: '100%', border: '1px solid #79d7ac', borderRadius: '6px', padding: '12px', fontSize: '12px', color: '#1f2937', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </Box>
            </Box>

            <Typography sx={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 600, color: '#111827', mb: 2 }}>
              Extra Amenities
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#6b7280', mb: 2 }}>
              Select Yes to enable the amenity and upload a photo for it
            </Typography>

            {/* ── Bedroom ── */}
            <SectionTitle title="Bedroom" subtitle="Upload the photo of the amenities" />
            <Grid container columnSpacing={6} rowSpacing={2.5}>
              <AmenityPair label="Sleeping bed (in build)" name="sleepingBedInBuild" value={formData.sleepingBedInBuild} onChange={handleChange} imageValue={amenityPhotos['sleepingBedInBuildPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Moon roof/ sun roof" name="moonRoof" value={formData.moonRoof} onChange={handleChange} imageValue={amenityPhotos['moonRoofPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Sleeping bed pop up" name="sleepingBedPopUp" value={formData.sleepingBedPopUp} onChange={handleChange} imageValue={amenityPhotos['sleepingBedPopUpPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Fan" name="fan" value={formData.fan} onChange={handleChange} imageValue={amenityPhotos['fanPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Sleeping sofa" name="sleepingSofa" value={formData.sleepingSofa} onChange={handleChange} imageValue={amenityPhotos['sleepingSofaPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Air Conditioner" name="airConditioner" value={formData.airConditioner} onChange={handleChange} imageValue={amenityPhotos['airConditionerPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Mobile charging point" name="mobileCharging" value={formData.mobileCharging} onChange={handleChange} imageValue={amenityPhotos['mobileChargingPhoto']} onImageChange={handleAmenityPhoto} />
            </Grid>

            {/* ── Bathroom ── */}
            <SectionTitle title="Bathroom" subtitle="Upload the photo of the amenities" />
            <Grid container columnSpacing={6} rowSpacing={2.5}>
              <AmenityPair label="Bathroom" name="bathroom" value={formData.bathroom} onChange={handleChange} imageValue={amenityPhotos['bathroomPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Fresh water Tank" name="freshWaterTank" value={formData.freshWaterTank} onChange={handleChange} imageValue={amenityPhotos['freshWaterTankPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Geyser" name="geyser" value={formData.geyser} onChange={handleChange} imageValue={amenityPhotos['geyserPhoto']} onImageChange={handleAmenityPhoto} />
              <Pair label="Fresh water" name="freshWater" value={formData.freshWater} onChange={handleChange} />
              <AmenityPair label="Waste Water disposal" name="wasteWaterDisposal" value={formData.wasteWaterDisposal} onChange={handleChange} imageValue={amenityPhotos['wasteWaterDisposalPhoto']} onImageChange={handleAmenityPhoto} />
              <Pair label="Grey Water" name="greyWater" value={formData.greyWater} onChange={handleChange} />
            </Grid>

            {/* ── Kitchen ── */}
            <SectionTitle title="Kitchen" subtitle="Upload the photo of the amenities" />
            <Grid container columnSpacing={6} rowSpacing={2.5}>
              <AmenityPair label="Micro wave" name="microwave" value={formData.microwave} onChange={handleChange} imageValue={amenityPhotos['microwavePhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Refrigerator" name="refrigerator" value={formData.refrigerator} onChange={handleChange} imageValue={amenityPhotos['refrigeratorPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Kitchen (inside)" name="kitchenInside" value={formData.kitchenInside} onChange={handleChange} imageValue={amenityPhotos['kitchenInsidePhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Kitchen (external)" name="kitchenExternal" value={formData.kitchenExternal} onChange={handleChange} imageValue={amenityPhotos['kitchenExternalPhoto']} onImageChange={handleAmenityPhoto} />
            </Grid>

            {/* ── Living Room ── */}
            <SectionTitle title="Living Room" subtitle="Upload the photo of the amenities" />
            <Grid container columnSpacing={6} rowSpacing={2.5}>
              <AmenityPair label="Entertainment system" name="entertainmentSystem" value={formData.entertainmentSystem} onChange={handleChange} imageValue={amenityPhotos['entertainmentSystemPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Dinner Table" name="dinnerTable" value={formData.dinnerTable} onChange={handleChange} imageValue={amenityPhotos['dinnerTablePhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Television" name="television" value={formData.television} onChange={handleChange} imageValue={amenityPhotos['televisionPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Couple Friendly" name="coupleFriendly" value={formData.coupleFriendly} onChange={handleChange} imageValue={amenityPhotos['coupleFriendlyPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Pet Friendly" name="petFriendly" value={formData.petFriendly} onChange={handleChange} imageValue={amenityPhotos['petFriendlyPhoto']} onImageChange={handleAmenityPhoto} />
            </Grid>

            {/* ── Other Facilities ── */}
            <SectionTitle title="Other Facilities" subtitle="Upload the photo of the amenities" />
            <Grid container columnSpacing={6} rowSpacing={2.5}>
              <AmenityPair label="Wifi" name="wifi" value={formData.wifi} onChange={handleChange} imageValue={amenityPhotos['wifiPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Battery & Inverter" name="batteryInverter" value={formData.batteryInverter} onChange={handleChange} imageValue={amenityPhotos['batteryInverterPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Security Camera" name="securityCamera" value={formData.securityCamera} onChange={handleChange} imageValue={amenityPhotos['securityCameraPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Iron Box" name="ironBox" value={formData.ironBox} onChange={handleChange} imageValue={amenityPhotos['ironBoxPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Parking assist" name="parkingAssist" value={formData.parkingAssist} onChange={handleChange} imageValue={amenityPhotos['parkingAssistPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Solar Panel" name="solarPanel" value={formData.solarPanel} onChange={handleChange} imageValue={amenityPhotos['solarPanelPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Camping Tent" name="campingTent" value={formData.campingTent} onChange={handleChange} imageValue={amenityPhotos['campingTentPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Camping Accessories" name="campingAccessories" value={formData.campingAccessories} onChange={handleChange} imageValue={amenityPhotos['campingAccessoriesPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Chauffer Driver" name="chautterDriver" value={formData.chautterDriver} onChange={handleChange} imageValue={amenityPhotos['chautterDriverPhoto']} onImageChange={handleAmenityPhoto} />
              <AmenityPair label="Awning" name="awning" value={formData.awning} onChange={handleChange} imageValue={amenityPhotos['awningPhoto']} onImageChange={handleAmenityPhoto} />
            </Grid>

            {/* ── Pricing ── */}
            <Typography sx={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 600, color: '#1f2937', mt: 6, mb: 3 }}>
              Pricing
            </Typography>
            <Grid container columnSpacing={6} rowSpacing={2.5}>
              <Pair label="Select Fixed Kms" isSelect options={YES_NO} name="fixedKms" value={formData.fixedKms} onChange={handleChange} />
              <Pair label="Price per night (₹)" placeholder="e.g. 2000" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} />
              <Pair label="Extra Kms. Rate (₹)" placeholder="e.g. 15" name="extraKmsRate" value={formData.extraKmsRate} onChange={handleChange} />
            </Grid>

            {/* ── Buttons ── */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 8 }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
                sx={{ width: 140, borderRadius: 8, color: '#000', borderColor: '#ef4444', textTransform: 'none', fontSize: '16px', fontWeight: 500, '&:hover': { borderColor: '#dc2626', bgcolor: '#fef2f2' } }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                disableElevation
                sx={{ width: 140, borderRadius: 8, bgcolor: '#52d88d', color: '#000', textTransform: 'none', fontSize: '16px', fontWeight: 500, '&:hover': { bgcolor: '#4ade80' } }}
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
