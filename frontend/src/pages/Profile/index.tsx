import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  Divider,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useWallet } from '../../contexts/WalletContext';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../../components/TransactionForm';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(26,26,26,0.9), rgba(10,10,10,0.9))',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  color: theme.palette.text.primary,
  border: '1px solid rgba(140, 82, 255, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(140, 82, 255, 0.15)',
  },
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #8c52ff, #5d35b0)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
  marginBottom: theme.spacing(3),
}));

const StatBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  background: 'rgba(140, 82, 255, 0.1)',
  marginBottom: theme.spacing(2),
}));

const Profile = () => {
  const { account, userProfile, balance, connect } = useWallet();
  const navigate = useNavigate();

  if (!account) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <GradientTypography variant="h5">
          Connect Your Wallet
        </GradientTypography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Please connect your wallet to view your profile
        </Typography>
        <Button
          variant="contained"
          onClick={connect}
          sx={{
            background: 'linear-gradient(45deg, #8c52ff, #5d35b0)',
            '&:hover': {
              background: 'linear-gradient(45deg, #7b46e3, #4c2d99)',
            },
          }}
        >
          Connect Wallet
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <GradientTypography variant="h5">
        User Profile
      </GradientTypography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Account Details
            </Typography>
            <StatBox>
              <Typography variant="body2" color="text.secondary">
                Wallet Address
              </Typography>
              <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                {account.address().toString()}
              </Typography>
            </StatBox>

            <StatBox>
              <Typography variant="body2" color="text.secondary">
                Balance
              </Typography>
              <Typography variant="h6" sx={{ color: '#8c52ff' }}>
                {balance} APT
              </Typography>
            </StatBox>

            <Divider sx={{ my: 3 }} />

            {userProfile && (
              <>
                <Typography variant="h6" gutterBottom>
                  Profile Statistics
                </Typography>

                <StatBox>
                  <Typography variant="body2" color="text.secondary">
                    Credit Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Box sx={{ flex: 1, mr: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(userProfile.creditScore / 100) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(140, 82, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(45deg, #8c52ff, #5d35b0)',
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="body1" sx={{ color: '#8c52ff' }}>
                      {userProfile.creditScore}
                    </Typography>
                  </Box>
                </StatBox>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <StatBox>
                      <Typography variant="body2" color="text.secondary">
                        Total Transactions
                      </Typography>
                      <Typography variant="h6">
                        {userProfile.totalTransactions}
                      </Typography>
                    </StatBox>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StatBox>
                      <Typography variant="body2" color="text.secondary">
                        Successful Verifications
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#4caf50' }}>
                        {userProfile.successfulVerifications}
                      </Typography>
                    </StatBox>
                  </Grid>
                </Grid>
              </>
            )}
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
