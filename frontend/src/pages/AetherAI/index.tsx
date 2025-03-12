import { Box, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { AptosAccount } from 'aptos';
import AetherChat from '../../components/AetherChat';
import DeFiTransactions from '../../components/DeFiTransactions';
import { defiAgent } from '../../utils/defiAgent';

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

const MetricBox = styled(Box)(({ theme }) => ({
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

const AetherAI = () => {
  const [account, setAccount] = useState<AptosAccount>();

  useEffect(() => {
    // Initialize a new account for testing
    // In production, this would come from wallet connection
    const newAccount = new AptosAccount();
    setAccount(newAccount);

    // Initialize profile if needed
    const initProfile = async () => {
      if (!newAccount) return;
      const result = await defiAgent.initializeProfile(newAccount);
      if (!result.success) {
        console.error('Failed to initialize profile:', result.error);
      }
    };
    initProfile();
  }, []);
  const metrics = [
    {
      title: "Average Risk Score",
      value: "15%",
      status: "low",
      description: "Current portfolio risk level is within safe parameters",
    },
    {
      title: "Biometric Confidence",
      value: "95%",
      status: "high",
      description: "High confidence in user authentication",
    },
    {
      title: "Anomaly Detection",
      value: "0",
      status: "good",
      description: "No suspicious activities detected in the last 24 hours",
    },
    {
      title: "AI Model Confidence",
      value: "92%",
      status: "high",
      description: "AI predictions are highly reliable",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <GradientTypography variant="h4" gutterBottom>
        AetherAI Dashboard
      </GradientTypography>
      <Grid container spacing={3}>
      <Grid item xs={12}>
        <StyledPaper>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 500,
              mb: 3
            }}
          >
            AI Security Overview
          </Typography>
          <Grid container spacing={3}>
            {metrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MetricBox>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {metric.title}
                  </Typography>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {metric.value}
                  </Typography>
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor:
                        metric.status === "low"
                          ? "#4CAF50"
                          : metric.status === "high"
                          ? "#4A7DFF"
                          : metric.status === "good"
                          ? "#4CAF50"
                          : "#FFA726",
                      mb: 1,
                    }}
                  >
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
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledPaper sx={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 500,
                  mb: 3
                }}
              >
                AI Assistant
              </Typography>
              <AetherChat />
            </StyledPaper>
          </Grid>
          <Grid item xs={12}>
            <DeFiTransactions account={account} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={4}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Recent AI Actions
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              {
                action: "Risk Assessment",
                time: "2 minutes ago",
                details: "Updated risk model based on new transaction patterns",
              },
              {
                action: "Anomaly Detection",
                time: "15 minutes ago",
                details: "Analyzed transaction flow for suspicious activities",
              },
              {
                action: "Liquidity Optimization",
                time: "1 hour ago",
                details: "Adjusted pool ranges based on market conditions",
              },
            ].map((item, index) => (
              <Box
                key={index}
                sx={{ p: 2, bgcolor: "#242538", borderRadius: 1 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
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
    </Box>
  );
};

export default AetherAI;
