import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import AetherAIWidget from '../Dashboard/components/AetherAIWidget';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1A1B2A',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  color: 'white',
}));

const MetricBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#242538',
  borderRadius: theme.spacing(1),
}));

const AetherAI = () => {
  const metrics = [
    {
      title: 'Average Risk Score',
      value: '15%',
      status: 'low',
      description: 'Current portfolio risk level is within safe parameters'
    },
    {
      title: 'Biometric Confidence',
      value: '95%',
      status: 'high',
      description: 'High confidence in user authentication'
    },
    {
      title: 'Anomaly Detection',
      value: '0',
      status: 'good',
      description: 'No suspicious activities detected in the last 24 hours'
    },
    {
      title: 'AI Model Confidence',
      value: '92%',
      status: 'high',
      description: 'AI predictions are highly reliable'
    }
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <StyledPaper>
          <Typography variant="h5" gutterBottom>
            AI Security Overview
          </Typography>
          <Grid container spacing={3}>
            {metrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MetricBox>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {metric.title}
                  </Typography>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {metric.value}
                  </Typography>
                  <Box sx={{ 
                    display: 'inline-block',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: 
                      metric.status === 'low' ? '#4CAF50' :
                      metric.status === 'high' ? '#4A7DFF' :
                      metric.status === 'good' ? '#4CAF50' : '#FFA726',
                    mb: 1
                  }}>
                    <Typography variant="caption">
                      {metric.status.toUpperCase()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {metric.description}
                  </Typography>
                </MetricBox>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      </Grid>

      <Grid item xs={12} md={8}>
        <StyledPaper sx={{ height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            AI Assistant
          </Typography>
          <AetherAIWidget />
        </StyledPaper>
      </Grid>

      <Grid item xs={12} md={4}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Recent AI Actions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              {
                action: 'Risk Assessment',
                time: '2 minutes ago',
                details: 'Updated risk model based on new transaction patterns'
              },
              {
                action: 'Anomaly Detection',
                time: '15 minutes ago',
                details: 'Analyzed transaction flow for suspicious activities'
              },
              {
                action: 'Liquidity Optimization',
                time: '1 hour ago',
                details: 'Adjusted pool ranges based on market conditions'
              }
            ].map((item, index) => (
              <Box key={index} sx={{ p: 2, bgcolor: '#242538', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2">{item.action}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.time}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item.details}
                </Typography>
              </Box>
            ))}
          </Box>
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default AetherAI;
