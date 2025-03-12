import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
    AppBar,
    Box,
    Container,
    CssBaseline,
    Tab,
    Tabs,
    Toolbar,
    Typography,
    Paper,
    TextField,
    Button,
    Stack
} from '@mui/material';
import { BiometricTracker } from './components/BiometricTracker';
import { RiskAssessment } from './components/RiskAssessment';
import { LiquidityOptimizer } from './components/LiquidityOptimizer';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2196f3',
        },
        secondary: {
            main: '#f50057',
        },
    },
});

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function App() {
    const [tabValue, setTabValue] = useState(0);
    const [amount, setAmount] = useState<string>('');
    const [recipientAddress, setRecipientAddress] = useState<string>('');
    const [biometricData, setBiometricData] = useState<any>(null);
    const [biometricConfidence, setBiometricConfidence] = useState<number>(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleBiometricDataCollected = (data: any) => {
        setBiometricData(data);
        // Convert boolean to confidence score
        setBiometricConfidence(data ? 100 : 0);
    };

    const handleTransaction = async () => {
        if (!amount || !recipientAddress || !biometricData) {
            alert('Please fill in all fields and complete biometric verification');
            return;
        }

        try {
            // This would normally call our backend service
            console.log('Transaction initiated:', {
                amount,
                recipientAddress,
                biometricData
            });
        } catch (error) {
            console.error('Transaction failed:', error);
            alert('Transaction failed. Please try again.');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            AetherAI DeFi Platform
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    <Paper sx={{ mb: 4, p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            AI-Powered DeFi Transaction Interface
                        </Typography>
                        <Stack spacing={3}>
                            <TextField
                                label="Amount (APT)"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Recipient Address"
                                value={recipientAddress}
                                onChange={(e) => setRecipientAddress(e.target.value)}
                                fullWidth
                            />
                            <BiometricTracker onBiometricDataCollected={handleBiometricDataCollected} />
                            {biometricData && (
                                <RiskAssessment
                                    amount={parseFloat(amount)}
                                    recipientAddress={recipientAddress}
                                    biometricConfidence={biometricConfidence}
                                />
                            )}
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleTransaction}
                                disabled={!amount || !recipientAddress || !biometricData}
                            >
                                Execute Secure Transaction
                            </Button>
                        </Stack>
                    </Paper>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange}>
                            <Tab label="Transaction Security" />
                            <Tab label="Liquidity Management" />
                        </Tabs>
                    </Box>

                    <TabPanel value={tabValue} index={0}>
                        <Typography variant="h6" gutterBottom>
                            AI-Driven Security Features
                        </Typography>
                        <Typography paragraph>
                            Our platform uses advanced AI to ensure transaction security:
                        </Typography>
                        <ul>
                            <li>Behavioral biometric authentication</li>
                            <li>Real-time risk assessment</li>
                            <li>Anomaly detection</li>
                            <li>Smart contract automation</li>
                        </ul>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <LiquidityOptimizer />
                    </TabPanel>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App;
