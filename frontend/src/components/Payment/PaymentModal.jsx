import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  IconButton, 
  Grid,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PaymentMethods from './PaymentMethods';
import UPIForm from './UPIForm';
import CardForm from './CardForm';
import SuccessScreen from './SuccessScreen';

export default function PaymentModal({ open, onClose, amount, businessName = "TravelKeet" }) {
  const [method, setMethod] = useState('upi');
  const [status, setStatus] = useState('idle'); // idle, loading, success, failure
  const [errorMessage, setErrorMessage] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async (paymentData = {}) => {
    setStatus('loading');

    try {
      const cleanAmount = Number(String(amount || 0).replace(/,/g, ''));
      const orderRes = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cleanAmount }),
      });
      const orderJson = await orderRes.json();

      if (!orderRes.ok || !orderJson?.success || !orderJson?.data?.orderId) {
        setErrorMessage(orderJson?.message || 'Failed to create order.');
        setStatus('failure');
        return;
      }

      // If backend returned a mock order (dev fallback), skip Razorpay and verify directly
      const returnedOrderId = String(orderJson.data.orderId || '');
      if (returnedOrderId.startsWith('order_mock_')) {
        try {
          // Create mock payment payload expected by verify endpoint
          const mockPayload = {
            razorpay_order_id: returnedOrderId,
            razorpay_payment_id: `payment_mock_${Date.now()}`,
            razorpay_signature: 'signature_mock',
          };
          const verifyRes = await fetch('http://localhost:5000/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockPayload),
          });
          const verifyJson = await verifyRes.json();
          if (verifyRes.ok && verifyJson?.success) {
            setStatus('success');
          } else {
            setErrorMessage(verifyJson?.message || 'Mock payment verification failed.');
            setStatus('failure');
          }
        } catch (err) {
          setErrorMessage(err?.message || 'Mock payment verification error.');
          setStatus('failure');
        }
        return;
      }

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const selectedMethod = (paymentData?.type || method || '').toLowerCase();
      const razorpayMethod = {
        upi: selectedMethod === 'upi',
        card: selectedMethod === 'card',
        netbanking: selectedMethod === 'netbanking',
        wallet: selectedMethod === 'wallets' || selectedMethod === 'wallet',
      };

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setErrorMessage('Failed to load Razorpay checkout script.');
        setStatus('failure');
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || orderJson.data.keyId,
        amount: orderJson.data.amount,
        currency: orderJson.data.currency || 'INR',
        name: businessName,
        description: 'Booking Payment',
        order_id: orderJson.data.orderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        method: razorpayMethod,
        theme: { color: '#339af0' },
        handler: async function (response) {
          try {
            const verifyRes = await fetch('http://localhost:5000/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const verifyJson = await verifyRes.json();
            if (verifyRes.ok && verifyJson?.success) {
              setStatus('success');
            } else {
              setErrorMessage(verifyJson?.message || 'Payment verification failed.');
              setStatus('failure');
            }
          } catch (error) {
            setErrorMessage(error?.message || 'Payment verification error.');
            setStatus('failure');
          }
        },
        modal: {
          ondismiss: function () {
            setStatus('idle');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (resp) {
        try {
          setErrorMessage(resp?.error?.description || 'Payment failed.');
        } catch (e) {
          setErrorMessage('Payment failed.');
        }
        setStatus('failure');
      });
      razorpay.open();
    } catch (error) {
      setErrorMessage(error?.message || 'Unexpected payment error.');
      setStatus('failure');
    }
  };

  const handleDone = () => {
    if (status === 'success') {
      onClose(true); // Close with success
    } else {
      setStatus('idle'); // Try again
      setErrorMessage('');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => status === 'idle' && onClose()}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows?.[10] || 10 }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {status === 'success' || status === 'failure' ? (
          <SuccessScreen success={status === 'success'} onDone={handleDone} message={errorMessage} />
        ) : (
          <Grid container sx={{ minHeight: 500 }}>
            {/* Sidebar - Hidden on mobile */}
            {!isMobile && (
              <Grid item md={4} sx={{ bgcolor: '#fff' }}>
                <PaymentMethods selected={method} onSelect={setMethod} />
              </Grid>
            )}

            {/* Main Content */}
            <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', p: 0 }}>
              {/* Header */}
              <Box sx={{
                bgcolor: '#374151',
                color: '#fff',
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
              }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                    Pay ₹{typeof amount === 'number' ? amount.toLocaleString('en-IN') : amount}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Payment for {businessName}
                  </Typography>
                </Box>
                <IconButton onClick={() => onClose()} sx={{ color: '#fff' }}>
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Form Area - scrollable, grows to fill */}
              <Box sx={{ p: 4, flex: 1, overflowY: 'auto' }}>
                {isMobile && (
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                    Select: UPI | Card | Banking
                  </Typography>
                )}

                {method === 'upi' && <UPIForm onPay={handlePayment} loading={status === 'loading'} />}
                {method === 'card' && <CardForm onPay={handlePayment} loading={status === 'loading'} />}

                {(method === 'netbanking' || method === 'wallets') && (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      Continue to Razorpay to complete payment using {method === 'netbanking' ? 'Net Banking' : 'Wallets'}.
                    </Typography>
                    <Button
                      variant="contained"
                      disabled={status === 'loading'}
                      onClick={() => handlePayment({ type: method })}
                      sx={{
                        bgcolor: '#339af0',
                        py: 1.5,
                        px: 4,
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#228be6' }
                      }}
                    >
                      {status === 'loading' ? 'Processing...' : 'Pay Now'}
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Footer - normal flow, always visible */}
              <Box sx={{
                p: 2,
                textAlign: 'center',
                borderTop: '1px solid #f3f4f6',
                bgcolor: '#f9fafb',
                flexShrink: 0,
              }}>
                <Typography variant="caption" sx={{ color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  🔒 Secure SSL Encryption | Powered by TravelKeet Pay
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}
