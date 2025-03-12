import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AptosAccount } from 'aptos';
import { defiAgent, UserProfile } from '../../utils/defiAgent';

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

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(140, 82, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(140, 82, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8c52ff',
    },
  },
}));

interface DeFiTransactionsProps {
  account?: AptosAccount;
}

const DeFiTransactions: React.FC<DeFiTransactionsProps> = ({ account }) => {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    if (account) {
      loadUserData();
    }
  }, [account]);

  const loadUserData = async () => {
    if (!account) return;

    try {
      const userProfile = await defiAgent.getUserProfile(account.address().toString());
      const userBalance = await defiAgent.getBalance(account.address().toString());
      
      if (userProfile.success && userProfile.data) {
        setProfile(userProfile.data);
      }
      
      if (userBalance.success && userBalance.data) {
        setBalance(userBalance.data);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const handleTransfer = async () => {
    if (!account || !recipientAddress || !amount) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate biometric data (in a real app, this would come from a biometric sensor)
      const mockBiometricData = new Uint8Array(32).fill(1);
      
      const result = await defiAgent.verifyAndTransfer(
        account,
        recipientAddress,
        parseFloat(amount),
        mockBiometricData
      );

      if (result.success && result.hash) {
        setSuccess(`Transaction successful! Hash: ${result.hash}`);
        setRecipientAddress('');
        setAmount('');
        loadUserData(); // Refresh user data
      } else {
        setError(result.error || 'Transaction failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledPaper>
      <GradientTypography variant="h5">
        DeFi Transactions
      </GradientTypography>

      {profile && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="primary">
            Credit Score: {profile.creditScore}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Transactions: {profile.totalTransactions}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Balance: {balance} APT
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <StyledTextField
          label="Recipient Address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          fullWidth
        />
        <StyledTextField
          label="Amount (APT)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleTransfer}
          disabled={loading || !account}
          sx={{
            background: 'linear-gradient(45deg, #8c52ff, #5d35b0)',
            '&:hover': {
              background: 'linear-gradient(45deg, #7b46e3, #4c2d99)',
            },
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'Transfer with Biometric Verification'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </Box>
    </StyledPaper>
  );
};

export default DeFiTransactions;
