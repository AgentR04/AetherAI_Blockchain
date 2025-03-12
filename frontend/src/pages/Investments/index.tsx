import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import InvestmentChart from '../Dashboard/components/InvestmentChart';

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

const MetricCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'linear-gradient(145deg, rgba(38,38,38,0.9), rgba(26,26,26,0.9))',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
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

const InvestmentMetric = ({ title, value, change }: { title: string; value: string; change: number }) => (
  <MetricCard>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
      {value}
    </Typography>
    <Typography
      variant="body2"
      sx={{ 
        color: change >= 0 ? '#4CAF50' : '#FF5252', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.5,
        mt: 1,
        fontWeight: 'medium'
      }}
    >
      {change >= 0 ? '+' : ''}{change}%
    </Typography>
  </MetricCard>
);

const InsightCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  background: 'linear-gradient(145deg, rgba(38,38,38,0.4), rgba(26,26,26,0.4))',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(1),
  border: '1px solid rgba(140, 82, 255, 0.1)',
  marginBottom: theme.spacing(1),
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateX(4px)',
  },
}));

const Investments = () => {
  const metrics = [
    { title: 'Total Value Locked', value: '$12,345,678', change: 2.5 },
    { title: 'Daily Volume', value: '$987,654', change: -1.2 },
    { title: 'Total Pools', value: '156', change: 0.8 },
    { title: 'Average APY', value: '12.5%', change: 1.5 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <GradientTypography variant="h4" gutterBottom>
        Investment Portfolio
      </GradientTypography>
      
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
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                color: 'primary.main',
                fontWeight: 500,
                mb: 3
              }}
            >
              Portfolio Distribution
            </Typography>
            <InvestmentChart />
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
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
              AI Insights
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'rgba(140, 82, 255, 0.05)', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Optimal Pool Range
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: 'text.primary' }}>
                Based on current market conditions and your risk profile, consider:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <InsightCard>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    • Increase BTC pool allocation by 5%
                  </Typography>
                </InsightCard>
                <InsightCard>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    • Maintain current ETH position
                  </Typography>
                </InsightCard>
                <InsightCard>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    • Consider reducing SOL exposure by 2%
                  </Typography>
                </InsightCard>
              </Box>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Investments;
