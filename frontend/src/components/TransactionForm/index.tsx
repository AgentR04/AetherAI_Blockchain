import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useWallet } from '../../contexts/WalletContext';
import { defiAgent } from '../../utils/defiAgent';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(26,26,26,0.9), rgba(10,10,10,0.9))',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  color: theme.palette.text.primary,
  border: '1px solid rgba(140, 82, 255, 0.1)',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #8c52ff, #5d35b0)',
  color: theme.palette.common.white,
  '&:hover': {
    background: 'linear-gradient(45deg, #7b46e3, #4c2d99)',
  },
  '&:disabled': {
    background: 'rgba(140, 82, 255, 0.3)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
}));

const TransactionForm = () => {
  const { account } = useWallet();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Generate a mock biometric hash for demo purposes
      const mockBiometricHash = new Uint8Array(32).fill(1);

      const response = await defiAgent.verifyAndTransfer(
        account,
        toAddress,
        Number(amount),
        mockBiometricHash
      );

      if (response.success) {
        setSuccess(`Transaction successful! Hash: ${response.hash}`);
        setToAddress('');
        setAmount('');
      } else {
        setError(response.error || 'Transaction failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Transfer Tokens
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Recipient Address"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            fullWidth
            required
            sx={{
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
            }}
          />
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            required
            sx={{
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
            }}
          />
          <GradientButton
            type="submit"
            variant="contained"
            disabled={loading || !account}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Processing...' : 'Send Transaction'}
          </GradientButton>
        </Box>
      </form>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </StyledPaper>
  );
};

export default TransactionForm;
