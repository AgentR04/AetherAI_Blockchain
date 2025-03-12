import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme
} from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import MouseIcon from '@mui/icons-material/Mouse';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import TimerIcon from '@mui/icons-material/Timer';

const BiometricsPage = () => {
  const [collecting, setCollecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mouseData, setMouseData] = useState<{ x: number; y: number; timestamp: number }[]>([]);
  const [keyTimings, setKeyTimings] = useState<{ key: string; duration: number }[]>([]);
  const theme = useTheme();

  const startCollection = () => {
    setCollecting(true);
    setProgress(0);
    setMouseData([]);
    setKeyTimings([]);

    // Start progress simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setCollecting(false);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    // Mouse movement tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMouseData(prev => [...prev, {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      }]);
    };

    // Keyboard timing tracking
    let keyDownTime = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      keyDownTime = Date.now();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const duration = Date.now() - keyDownTime;
      setKeyTimings(prev => [...prev, {
        key: e.key,
        duration
      }]);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Cleanup after 10 seconds
    setTimeout(() => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      setCollecting(false);
      setProgress(100);
    }, 10000);
  };

  const getBiometricScore = () => {
    // Simple scoring based on collected data
    const mouseScore = Math.min(mouseData.length / 100, 1) * 100;
    const keyScore = Math.min(keyTimings.length * 5, 100);
    return Math.round((mouseScore + keyScore) / 2);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          background: 'linear-gradient(45deg, #8c52ff, #5d35b0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          mb: 4
        }}
      >
        Behavioral Biometrics Analysis
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card 
            sx={{ 
              background: 'linear-gradient(145deg, rgba(26,26,26,0.9), rgba(10,10,10,0.9))',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              border: '1px solid rgba(140, 82, 255, 0.1)'
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                Data Collection
              </Typography>
              {collecting ? (
                <Box sx={{ width: '100%', mb: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(140, 82, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(45deg, #8c52ff, #5d35b0)',
                        borderRadius: 4,
                      }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    Collecting behavioral data... {progress}%
                  </Typography>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  onClick={startCollection}
                  startIcon={<FingerprintIcon />}
                  sx={{
                    background: 'linear-gradient(45deg, #8c52ff, #5d35b0)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #7b45e6, #4c2b94)',
                    },
                    px: 4,
                    py: 1.5
                  }}
                >
                  Start Biometric Collection
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 2,
              background: 'linear-gradient(145deg, rgba(26,26,26,0.9), rgba(10,10,10,0.9))',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              border: '1px solid rgba(140, 82, 255, 0.1)'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Collected Metrics
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  <MouseIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Mouse Movements" 
                  secondary={`${mouseData.length} data points`}
                  secondaryTypographyProps={{ sx: { color: 'text.secondary' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  <KeyboardIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Keyboard Patterns" 
                  secondary={`${keyTimings.length} keystrokes`}
                  secondaryTypographyProps={{ sx: { color: 'text.secondary' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  <TimerIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Biometric Score" 
                  secondary={`${getBiometricScore()}%`}
                  secondaryTypographyProps={{ sx: { color: 'text.secondary' } }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BiometricsPage;
