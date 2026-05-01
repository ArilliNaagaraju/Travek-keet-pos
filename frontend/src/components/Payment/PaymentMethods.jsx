import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Box 
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SmartphoneIcon from '@mui/icons-material/Smartphone';

const methods = [
  { id: 'upi', label: 'UPI', icon: <SmartphoneIcon /> },
  { id: 'card', label: 'Card', icon: <CreditCardIcon /> },
  { id: 'netbanking', label: 'Net Banking', icon: <AccountBalanceIcon /> },
  { id: 'wallets', label: 'Wallets', icon: <AccountBalanceWalletIcon /> },
];

export default function PaymentMethods({ selected, onSelect }) {
  return (
    <Box sx={{ borderRight: '1px solid #e5e7eb', height: '100%' }}>
      <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>
        Payment Methods
      </Typography>
      <List sx={{ p: 0 }}>
        {methods.map((method) => (
          <ListItem key={method.id} disablePadding>
            <ListItemButton 
              selected={selected === method.id}
              onClick={() => onSelect(method.id)}
              sx={{
                py: 2,
                '&.Mui-selected': {
                  bgcolor: '#f3f4f6',
                  borderLeft: '4px solid #339af0',
                  '& .MuiListItemIcon-root': { color: '#339af0' },
                  '& .MuiListItemText-primary': { color: '#111827', fontWeight: 700 }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: '#6b7280' }}>
                {method.icon}
              </ListItemIcon>
              <ListItemText 
                primary={method.label} 
                primaryTypographyProps={{ fontSize: '14px', color: '#4b5563', fontWeight: 500 }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
