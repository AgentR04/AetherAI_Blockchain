import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MarketTable from '../Dashboard/components/MarketTable';
import CryptoStats from '../Dashboard/components/CryptoStats';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1A1B2A',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  color: 'white',
}));

const MarketUpdate = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <StyledPaper>
          <Typography variant="h5" gutterBottom>
            Market Overview
          </Typography>
          <CryptoStats />
        </StyledPaper>
      </Grid>
      <Grid item xs={12}>
        <StyledPaper>
          <Typography variant="h5" gutterBottom>
            Market Update
          </Typography>
          <MarketTable />
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default MarketUpdate;
