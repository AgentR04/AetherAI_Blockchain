import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import MarketTable from './components/MarketTable';
import CryptoStats from './components/CryptoStats';
import RecentActivities from './components/RecentActivities';
import InvestmentChart from './components/InvestmentChart';
import AetherAIWidget from './components/AetherAIWidget';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1A1B2A',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  color: 'white',
}));

const Dashboard = () => {
  return (
    <Grid container spacing={3}>
      {/* Market Update Section */}
      <Grid item xs={12}>
        <StyledPaper>
          <Typography variant="h5" gutterBottom>
            Market Update
          </Typography>
          <MarketTable />
        </StyledPaper>
      </Grid>

      {/* Crypto Stats */}
      <Grid item xs={12}>
        <StyledPaper>
          <CryptoStats />
        </StyledPaper>
      </Grid>

      {/* Recent Activities and Investments */}
      <Grid item xs={12} md={8}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <RecentActivities />
            </StyledPaper>
          </Grid>
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Investments
              </Typography>
              <InvestmentChart />
            </StyledPaper>
          </Grid>
        </Grid>
      </Grid>

      {/* Aether AI Widget */}
      <Grid item xs={12} md={4}>
        <StyledPaper sx={{ height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Aether AI
          </Typography>
          <AetherAIWidget />
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
