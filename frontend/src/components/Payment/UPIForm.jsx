import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress 
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';

export default function UPIForm({ onPay, loading }) {
  const [upiId, setUpiId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (upiId) onPay({ type: 'UPI', id: upiId });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#4b5563' }}>
        Enter UPI ID
      </Typography>
      <TextField
        fullWidth
        placeholder="example@upi"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        required
        size="small"
        sx={{ mb: 3 }}
      />
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 3, 
        border: '1px dashed #d1d5db', 
        borderRadius: 2,
        mb: 4,
        bgcolor: '#f9fafb'
      }}>
        <QrCode2Icon sx={{ fontSize: 120, color: '#374151', opacity: 0.8 }} />
        <Typography variant="caption" sx={{ mt: 1, color: '#6b7280' }}>
          Scan QR to pay
        </Typography>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || !upiId}
        sx={{ 
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
