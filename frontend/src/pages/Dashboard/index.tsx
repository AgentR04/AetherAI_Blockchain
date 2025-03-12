import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import MarketTable from './components/MarketTable';
import CryptoStats from './components/CryptoStats';
import RecentActivities from './components/RecentActivities';
import InvestmentChart from './components/InvestmentChart';
import AetherAIWidget from './components/AetherAIWidget';
import TransactionForm from '../../components/TransactionForm';
import { useWallet } from '../../contexts/WalletContext';

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

const Dashboard = () => {
  const { account } = useWallet();
  return (
    <Box sx={{ p: 3 }}>
      <GradientTypography variant="h4" gutterBottom>
        Dashboard Overview
      </GradientTypography>
      <Grid container spacing={3}>
        {/* Market Update Section */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                color: 'primary.main',
                fontWeight: 500,
                mb: 3
              }}
            >
              Market Update
            </Typography>
            <MarketTable />
          </StyledPaper>
        </Grid>

        {/* Crypto Stats */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                color: 'primary.main',
                fontWeight: 500,
                mb: 3
              }}
            >
              Crypto Statistics
            </Typography>
            <CryptoStats />
          </StyledPaper>
        </Grid>

        {/* Recent Activities and Investments */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledPaper>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 500,
                    mb: 3
                  }}
                >
                  Recent Activities
                </Typography>
                <RecentActivities />
              </StyledPaper>
            </Grid>
            <Grid item xs={12}>
              <StyledPaper>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 500,
                    mb: 3
                  }}
                >
                  Investment Performance
                </Typography>
                <InvestmentChart />
              </StyledPaper>
            </Grid>
          </Grid>
        </Grid>

        {/* Aether AI Widget */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledPaper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 500,
                    mb: 3
                  }}
                >
                  Aether AI Assistant
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <AetherAIWidget />
                </Box>
              </StyledPaper>
            </Grid>
            {account && (
              <Grid item xs={12}>
                <StyledPaper>
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 500,
                      mb: 3
                    }}
                  >
                    Quick Transfer
                  </Typography>
                  <TransactionForm />
                </StyledPaper>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
