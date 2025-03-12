import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import InvestmentChart from '../Dashboard/components/InvestmentChart';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1A1B2A',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  color: 'white',
}));

const InvestmentMetric = ({ title, value, change }: { title: string; value: string; change: number }) => (
  <Box sx={{ p: 2, bgcolor: '#242538', borderRadius: 2 }}>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h6">{value}</Typography>
    <Typography
      variant="body2"
      sx={{ color: change >= 0 ? '#4CAF50' : '#FF5252', display: 'flex', alignItems: 'center', gap: 0.5 }}
    >
      {change >= 0 ? '+' : ''}{change}%
    </Typography>
  </Box>
);

const Investments = () => {
  const metrics = [
    { title: 'Total Value Locked', value: '$12,345,678', change: 2.5 },
    { title: 'Daily Volume', value: '$987,654', change: -1.2 },
    { title: 'Total Pools', value: '156', change: 0.8 },
    { title: 'Average APY', value: '12.5%', change: 1.5 },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <StyledPaper>
          <Typography variant="h5" gutterBottom>
            Investment Overview
          </Typography>
          <Grid container spacing={3}>
            {metrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <InvestmentMetric {...metric} />
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      </Grid>

      <Grid item xs={12} md={8}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Portfolio Distribution
          </Typography>
          <InvestmentChart />
        </StyledPaper>
      </Grid>

      <Grid item xs={12} md={4}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            AI Insights
          </Typography>
          <Box sx={{ p: 2, bgcolor: '#242538', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Optimal Pool Range
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Based on current market conditions and your risk profile, consider:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ p: 1, bgcolor: 'rgba(74, 125, 255, 0.1)', borderRadius: 1 }}>
                <Typography variant="body2">
                  • Increase BTC pool allocation by 5%
                </Typography>
              </Box>
              <Box sx={{ p: 1, bgcolor: 'rgba(74, 125, 255, 0.1)', borderRadius: 1 }}>
                <Typography variant="body2">
                  • Maintain current ETH position
                </Typography>
              </Box>
              <Box sx={{ p: 1, bgcolor: 'rgba(74, 125, 255, 0.1)', borderRadius: 1 }}>
                <Typography variant="body2">
                  • Consider reducing SOL exposure by 2%
                </Typography>
              </Box>
            </Box>
          </Box>
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default Investments;
