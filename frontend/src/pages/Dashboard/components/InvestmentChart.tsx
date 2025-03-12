import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

interface Investment {
  name: string;
  value: number;
  color: string;
  riskScore: number;
  aiConfidence: number;
}

const data: Investment[] = [
  {
    name: 'BTC Pool',
    value: 45623,
    color: '#FF9800',
    riskScore: 0.2,
    aiConfidence: 0.95
  },
  {
    name: 'ETH Pool',
    value: 32456,
    color: '#2196F3',
    riskScore: 0.3,
    aiConfidence: 0.90
  },
  {
    name: 'SOL Pool',
    value: 21789,
    color: '#4CAF50',
    riskScore: 0.4,
    aiConfidence: 0.85
  }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <Box sx={{ 
        bgcolor: '#242538',
        p: 2,
        borderRadius: 1,
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Typography variant="subtitle2" color="white">
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Value: ${item.value.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Risk Score: {(item.riskScore * 100).toFixed(0)}%
        </Typography>
        <Typography variant="body2" color="text.secondary">
          AI Confidence: {(item.aiConfidence * 100).toFixed(0)}%
        </Typography>
      </Box>
    );
  }
  return null;
};

const InvestmentChart = () => {
  return (
    <StyledBox>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">March 2023</Typography>
        <Box>
          <IconButton size="small" sx={{ color: 'white' }}>
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: 'white' }}>
            <NavigateNextIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 150 }}>
          {data.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: item.color
                }}
              />
              <Box>
                <Typography variant="body2">{item.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  ${item.value.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </StyledBox>
  );
};

export default InvestmentChart;
