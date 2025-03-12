import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

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

const MarketAnalysis = () => {
  return (
    <Box sx={{ p: 3 }}>
      <GradientTypography variant="h4" gutterBottom>
        Market Analysis
      </GradientTypography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Market Overview
            </Typography>
            {/* Add market analysis content here */}
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarketAnalysis;
