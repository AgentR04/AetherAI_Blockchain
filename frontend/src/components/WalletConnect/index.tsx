import React, { useState } from 'react';
import { Button, Box, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useWallet } from '../../contexts/WalletContext';

const WalletButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #8c52ff, #5d35b0)',
  color: theme.palette.common.white,
  padding: theme.spacing(1, 3),
  borderRadius: theme.spacing(2),
  '&:hover': {
    background: 'linear-gradient(45deg, #7442e6, #4d2b99)',
  },
}));

const AddressText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(1),
}));

const BalanceText = styled(Typography)(({ theme }) => ({
  color: '#8c52ff',
  fontWeight: 'bold',
  fontSize: '0.875rem',
}));

const WalletConnect = () => {
  const { account, isConnecting, connect, disconnect, balance } = useWallet();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnecting) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CircularProgress size={24} sx={{ color: '#8c52ff' }} />
      </Box>
    );
  }

  if (account) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <BalanceText>{balance} APT</BalanceText>
        <Box sx={{ mx: 2 }}>•</Box>
        <AddressText>{formatAddress(account.address().toString())}</AddressText>
        <WalletButton
          variant="contained"
          onClick={disconnect}
          startIcon={<AccountBalanceWalletIcon />}
          size="small"
          sx={{ ml: 2 }}
        >
          Disconnect
        </WalletButton>
      </Box>
    );
  }

  return (
    <>
      <WalletButton
        variant="contained"
        onClick={handleConnect}
        startIcon={<AccountBalanceWalletIcon />}
      >
        Connect Wallet
      </WalletButton>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WalletConnect;
