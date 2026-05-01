import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  CircularProgress 
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export default function CardForm({ onPay, loading }) {
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPay({ type: 'Card', ...cardData });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#4b5563' }}>
        Card Details
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Card Number"
            name="number"
            placeholder="0000 0000 0000 0000"
            value={cardData.number}
            onChange={handleChange}
            required
            size="small"
            InputProps={{
              endAdornment: <CreditCardIcon sx={{ color: '#9ca3af' }} />
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Expiry Date"
            name="expiry"
            placeholder="MM/YY"
            value={cardData.expiry}
            onChange={handleChange}
            required
            size="small"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="CVV"
            name="cvv"
            type="password"
            placeholder="123"
            value={cardData.cvv}
            onChange={handleChange}
            required
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Cardholder Name"
            name="name"
            placeholder="John Doe"
            value={cardData.name}
            onChange={handleChange}
            required
            size="small"
          />
        </Grid>
      </Grid>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ 
          mt: 4,
          bgcolor: '#339af0', 
          py: 1.5, 
          fontWeight: 700,
          '&:hover': { bgcolor: '#228be6' }
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Pay Now'}
      </Button>
    </Box>
  );
}
