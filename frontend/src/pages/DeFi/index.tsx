import React from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeFiTransactions from '../../components/DeFiTransactions';
import { useWallet } from '../../contexts/WalletContext';

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #8c52ff, #5d35b0)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
  marginBottom: theme.spacing(3),
}));

const DeFi = () => {
  const { account, connect, isConnecting } = useWallet();

  return (
    <Box sx={{ p: 3 }}>
      <GradientTypography variant="h4" gutterBottom>
        DeFi Dashboard
      </GradientTypography>
      {!account ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Connect your wallet to access DeFi features
          </Typography>
          <Button
            variant="contained"
            onClick={connect}
            disabled={isConnecting}
            sx={{
              mt: 2,
              background: 'linear-gradient(45deg, #8c52ff, #5d35b0)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7b46e3, #4c2d99)',
              },
            }}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <DeFiTransactions account={account} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default DeFi;
