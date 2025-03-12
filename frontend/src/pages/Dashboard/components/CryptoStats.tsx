import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StatBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: '#242538',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const StyledValue = styled(Typography)<{ trend?: 'up' | 'down' }>(({ theme, trend }) => ({
  color: trend === 'up' ? '#4CAF50' : trend === 'down' ? '#FF5252' : 'white',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

interface StatData {
  title: string;
  value: string;
  change: number;
  timestamp: string;
}

const stats: StatData[] = [
  {
    title: 'Volume',
    value: '65,54,253',
    change: 0.12,
    timestamp: '36.64.20'
  },
  {
    title: 'Turnover',
    value: '65,54,253',
    change: -0.75,
    timestamp: '36.64.20'
  },
  {
    title: 'Circuits',
    value: '65,54,253',
    change: -1.24,
    timestamp: '36.64.20'
  }
];

const CryptoStats = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h6">Market Overview</Typography>
          <Typography variant="body2" color="text.secondary">
            2,653,349,468.51
          </Typography>
          <Box sx={{ 
            bgcolor: '#FF5252',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5
          }}>
            <TrendingDownIcon fontSize="small" />
            -0.12%
          </Box>
        </Box>
      </Grid>
      {stats.map((stat, index) => (
        <Grid item xs={12} md={4} key={index}>
          <StatBox>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.timestamp}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                {stat.value}
              </Typography>
              <StyledValue variant="body2" trend={stat.change >= 0 ? 'up' : 'down'}>
                {stat.change >= 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                {stat.change >= 0 ? '+' : ''}{stat.change}%
              </StyledValue>
            </Box>
          </StatBox>
        </Grid>
      ))}
    </Grid>
  );
};

export default CryptoStats;
