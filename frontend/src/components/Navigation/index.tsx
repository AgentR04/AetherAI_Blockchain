import React from 'react';
import { Link as RouterLink, useLocation, Navigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  useTheme,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

import WalletConnect from '../WalletConnect';
import { useWallet } from '../../contexts/WalletContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(26,26,26,0.9), rgba(10,10,10,0.9))',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(140, 82, 255, 0.1)',
}));

const NavButton = styled(Button)<{ component?: React.ElementType; to?: string; }>(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginRight: theme.spacing(2),
  '&.active': {
    color: '#8c52ff',
  },
  '&:hover': {
    color: '#8c52ff',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #8c52ff, #5d35b0)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  marginRight: theme.spacing(4),
}));

const StyledProfileButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(2),
  '&.active': {
    color: '#8c52ff',
  },
  '&:hover': {
    color: '#8c52ff',
  },
}));

const Navigation = () => {
  const location = useLocation();
  const theme = useTheme();
  const { account } = useWallet();

  // Handle default route
  if (location.pathname === '/') {
    return <Navigate to="/dashboard" replace />;
  }

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/market-analysis', label: 'Market Analysis', icon: <ShowChartIcon /> },
    { path: '/investments', label: 'Investments', icon: <AccountBalanceIcon /> },
    { path: '/ai', label: 'AetherAI', icon: <SmartToyIcon /> },
  ];

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <LogoText variant="h6">
          AetherAI
        </LogoText>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {navItems.map((item) => (
            <NavButton
              key={item.path}
              component={RouterLink}
              to={item.path}
              className={isActive(item.path) ? 'active' : ''}
              startIcon={item.icon}
            >
              {item.label}
            </NavButton>
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <WalletConnect />
          {account && (
            <RouterLink to="/profile" style={{ textDecoration: 'none' }}>
              <StyledProfileButton className={isActive('/profile') ? 'active' : ''}>
                <PersonIcon />
              </StyledProfileButton>
            </RouterLink>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navigation;
