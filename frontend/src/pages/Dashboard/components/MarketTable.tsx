import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: 'white',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
}));

interface MarketData {
  id: number;
  symbol: string;
  name: string;
  ltp: number;
  change24h: number;
  quantity: number;
  chartData: { value: number }[];
  riskScore: number;
  biometricConfidence: number;
}

const dummyData: MarketData[] = [
  {
    id: 1,
    symbol: 'BTC',
    name: 'Bitcoin',
    ltp: 315.70,
    change24h: 1.45,
    quantity: 34823,
    chartData: Array(20).fill(0).map(() => ({ value: Math.random() * 100 })),
    riskScore: 0.2,
    biometricConfidence: 0.95
  },
  {
    id: 2,
    symbol: 'ETH',
    name: 'Ethereum',
    ltp: 1082.70,
    change24h: -0.12,
    quantity: 34823,
    chartData: Array(20).fill(0).map(() => ({ value: Math.random() * 100 })),
    riskScore: 0.4,
    biometricConfidence: 0.85
  },
  {
    id: 3,
    symbol: 'SOL',
    name: 'Solana',
    ltp: 1082.70,
    change24h: -0.75,
    quantity: 34823,
    chartData: Array(20).fill(0).map(() => ({ value: Math.random() * 100 })),
    riskScore: 0.6,
    biometricConfidence: 0.75
  },
  {
    id: 4,
    symbol: 'APT',
    name: 'Aptos',
    ltp: 315.70,
    change24h: 1.45,
    quantity: 5219,
    chartData: Array(20).fill(0).map(() => ({ value: Math.random() * 100 })),
    riskScore: 0.3,
    biometricConfidence: 0.90
  },
];

const MarketTable = () => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Symbol</StyledTableCell>
            <StyledTableCell>LTP</StyledTableCell>
            <StyledTableCell>24h %</StyledTableCell>
            <StyledTableCell>Quantity</StyledTableCell>
            <StyledTableCell>Last 7 Days</StyledTableCell>
            <StyledTableCell>Risk Score</StyledTableCell>
            <StyledTableCell>Biometric Confidence</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dummyData.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>{row.symbol}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {row.name}
                  </Typography>
                </Box>
              </StyledTableCell>
              <StyledTableCell>${row.ltp.toFixed(2)}</StyledTableCell>
              <StyledTableCell sx={{ color: row.change24h >= 0 ? '#4CAF50' : '#FF5252' }}>
                {row.change24h >= 0 ? '+' : ''}{row.change24h}%
              </StyledTableCell>
              <StyledTableCell>{row.quantity.toLocaleString()}</StyledTableCell>
              <StyledTableCell>
                <Box sx={{ width: 120, height: 40 }}>
                  <ResponsiveContainer>
                    <LineChart data={row.chartData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={row.change24h >= 0 ? '#4CAF50' : '#FF5252'}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                <Box sx={{ 
                  bgcolor: row.riskScore < 0.3 ? '#4CAF50' : row.riskScore < 0.6 ? '#FFA726' : '#FF5252',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  display: 'inline-block'
                }}>
                  {(row.riskScore * 100).toFixed(0)}%
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                <Box sx={{ 
                  bgcolor: row.biometricConfidence > 0.8 ? '#4CAF50' : '#FFA726',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  display: 'inline-block'
                }}>
                  {(row.biometricConfidence * 100).toFixed(0)}%
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                <IconButton size="small" sx={{ color: 'gold' }}>
                  <StarIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MarketTable;
