import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Paper, Button } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface LiquidityMetrics {
    poolDepth: number;
    volatility: number;
    volume24h: number;
    currentPrice: number;
    priceChange24h: number;
    optimalRange: {
        min: number;
        max: number;
    };
}

export const LiquidityOptimizer: React.FC = () => {
    const [metrics, setMetrics] = useState<LiquidityMetrics>({
        poolDepth: 1000000,
        volatility: 0.15,
        volume24h: 500000,
        currentPrice: 1.2,
        priceChange24h: 0.05,
        optimalRange: {
            min: 0.8,
            max: 1.6
        }
    });

    const [historicalData] = useState(() => {
        // Simulate 24 hours of data points
        const hours = Array.from({ length: 24 }, (_, i) => i);
        return {
            labels: hours.map(h => `${h}:00`),
            datasets: [
                {
                    label: 'Pool Liquidity',
                    data: hours.map(() => Math.random() * 1000000 + 500000),
                    borderColor: '#2196f3',
                    tension: 0.4
                },
                {
                    label: 'Optimal Liquidity',
                    data: hours.map(() => 1000000),
                    borderColor: '#4caf50',
                    borderDash: [5, 5],
                    tension: 0.1
                }
            ]
        };
    });

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Liquidity Optimization Analysis'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Liquidity (USD)'
                }
            }
        }
    };

    const MetricCard: React.FC<{ title: string; value: string | number; subtitle?: string }> = ({
        title,
        value,
        subtitle
    }) => (
        <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h5" sx={{ mb: 1 }}>
                {typeof value === 'number' ? 
                    value.toLocaleString('en-US', { 
                        style: 'currency', 
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }) : 
                    value
                }
            </Typography>
            {subtitle && (
                <Typography variant="body2" color="textSecondary">
                    {subtitle}
                </Typography>
            )}
        </Paper>
    );

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    AI-Driven Liquidity Management
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <MetricCard
                            title="Current Pool Depth"
                            value={metrics.poolDepth}
                            subtitle="Total liquidity in pool"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <MetricCard
                            title="24h Volume"
                            value={metrics.volume24h}
                            subtitle={`${(metrics.volume24h / metrics.poolDepth * 100).toFixed(2)}% of pool depth`}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <MetricCard
                            title="Volatility"
                            value={`${(metrics.volatility * 100).toFixed(2)}%`}
                            subtitle="30-day rolling volatility"
                        />
                    </Grid>
                </Grid>

                <Box sx={{ height: 400, mb: 4 }}>
                    <Line options={chartOptions} data={historicalData} />
                </Box>

                <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        AI Optimization Recommendations
                    </Typography>
                    <Typography variant="body2" paragraph>
                        Based on current market conditions and AI analysis:
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, bgcolor: '#e8f5e9' }}>
                                <Typography variant="subtitle2" gutterBottom color="success.main">
                                    Optimal Liquidity Range
                                </Typography>
                                <Typography variant="body2">
                                    Min: ${metrics.optimalRange.min.toLocaleString()}
                                </Typography>
                                <Typography variant="body2">
                                    Max: ${metrics.optimalRange.max.toLocaleString()}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
                                <Typography variant="subtitle2" gutterBottom color="primary.main">
                                    Suggested Actions
                                </Typography>
                                <Typography variant="body2">
                                    {metrics.poolDepth < metrics.optimalRange.min
                                        ? "Consider adding more liquidity to optimize returns"
                                        : metrics.poolDepth > metrics.optimalRange.max
                                        ? "Consider removing excess liquidity to improve efficiency"
                                        : "Current liquidity is within optimal range"}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" color="primary">
                        Adjust Liquidity
                    </Button>
                    <Button variant="contained" color="primary">
                        Apply AI Optimization
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};
