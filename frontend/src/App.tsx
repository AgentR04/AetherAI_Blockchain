import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

// Import components
import Navigation from "./components/Navigation";

// Import pages
import Dashboard from "./pages/Dashboard";
import MarketAnalysis from "./pages/MarketAnalysis";
import Investments from "./pages/Investments";
import AetherAI from "./pages/AetherAI";
import DeFi from "./pages/DeFi";

// Import providers
import { WalletProvider } from "./contexts/WalletContext";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8c52ff', // Purple accent color
    },
    secondary: {
      main: '#5d35b0',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <WalletProvider>
          <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: 'background.default' }}>
            <Navigation />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                mt: "64px",
              }}
            >
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/market-analysis" element={<MarketAnalysis />} />
                <Route path="/investments" element={<Investments />} />
                <Route path="/ai" element={<AetherAI />} />
                <Route path="/defi" element={<DeFi />} />
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </Box>
          </Box>
        </WalletProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
