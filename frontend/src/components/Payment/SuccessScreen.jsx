import React from 'react';
import { Box, Typography, Button, Zoom } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function SuccessScreen({ success, onDone, message }) {
  return (
    <Zoom in={true}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 6,
        textAlign: 'center'
      }}>
        {success ? (
          <>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: '#10b981', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#111827' }}>
              Payment Successful
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mb: 4 }}>
              Your booking has been confirmed. A receipt has been sent to your email.
            </Typography>
          </>
        ) : (
          <>
            <ErrorOutlineIcon sx={{ fontSize: 80, color: '#ef4444', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#111827' }}>
              Payment Failed
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mb: 4 }}>
              {message || 'Something went wrong. Please try again or use another payment method.'}
            </Typography>
          </>
        )}
        
        <Button 
          variant="contained" 
          onClick={onDone}
          sx={{ 
            bgcolor: success ? '#10b981' : '#374151', 
            px: 6, 
            py: 1, 
            borderRadius: 2,
            fontWeight: 700
          }}
        >
          {success ? 'Continue' : 'Try Again'}
        </Button>
      </Box>
    </Zoom>
  );
}
