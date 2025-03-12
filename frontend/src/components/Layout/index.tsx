import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#0A0B1E',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: 'white',
  textDecoration: 'none',
  marginRight: theme.spacing(3),
  '&:hover': {
    color: '#4A7DFF',
  },
}));

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#070817' }}>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <StyledLink to="/">AetherAI</StyledLink>
          </Typography>
          <Box>
            <Button color="inherit" component={StyledLink} to="/market">
              Market Update
            </Button>
            <Button color="inherit" component={StyledLink} to="/investments">
              Investments
            </Button>
            <Button color="inherit" component={StyledLink} to="/ai">
              Aether AI
            </Button>
            <Button variant="contained" color="primary" sx={{ ml: 2 }}>
              Connect Wallet
            </Button>
          </Box>
        </Toolbar>
      </StyledAppBar>
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
