import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PersonIcon from '@mui/icons-material/Person';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { text: 'Market Analysis', path: '/market', icon: <ShowChartIcon /> },
    { text: 'Investments', path: '/investments', icon: <AccountBalanceWalletIcon /> },
    { text: 'AetherAI', path: '/ai', icon: <SmartToyIcon /> },
    { text: 'Biometrics', path: '/biometrics', icon: <FingerprintIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobileOpen) {
      handleDrawerToggle();
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <PersonIcon />
        </Avatar>
        <Typography variant="subtitle1" noWrap>
          User Account
        </Typography>
      </Box>
      <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: '8px',
                mx: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(140, 82, 255, 0.1)',
                },
              }}
            >
              <Box sx={{ mr: 2, color: location.pathname === item.path ? 'white' : 'primary.main' }}>
                {item.icon}
              </Box>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(to right, #000000, #1a1a1a)',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              background: 'linear-gradient(45deg, #8c52ff, #5d35b0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            AetherAI Blockchain
          </Typography>
          {!isMobile && (
            <Stack direction="row" spacing={1}>
              <Button 
                variant="outlined" 
                color="primary"
                sx={{ 
                  borderColor: 'rgba(140, 82, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(140, 82, 255, 0.1)',
                  }
                }}
              >
                Sign In
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                sx={{
                  background: 'linear-gradient(45deg, #8c52ff, #5d35b0)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #7b45e6, #4c2b94)',
                  }
                }}
              >
                Register
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={isMobile ? handleDrawerToggle : undefined}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            mt: '64px',
            height: 'calc(100% - 64px)',
            background: '#000000',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
