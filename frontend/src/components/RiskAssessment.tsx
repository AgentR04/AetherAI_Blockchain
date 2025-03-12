import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface RiskAssessmentProps {
    amount: number;
    recipientAddress: string;
    biometricConfidence: number;
}

interface RiskMetrics {
    riskScore: number;
    anomalyScore: number;
    recommendations: string[];
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({
    amount,
    recipientAddress,
    biometricConfidence
}) => {
    const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const assessRisk = async () => {
            try {
                // This would normally call our backend AI service
                // For demo, we'll simulate the risk assessment
                const simulatedRisk = {
                    riskScore: Math.random() * 100,
                    anomalyScore: Math.random() * 100,
                    recommendations: [
                        'Verify recipient address',
                        'Consider transaction amount',
                        'Check transaction timing'
                    ]
                };

                setRiskMetrics(simulatedRisk);
                setLoading(false);
            } catch (error) {
                console.error('Error assessing risk:', error);
                setLoading(false);
            }
        };

        assessRisk();
    }, [amount, recipientAddress, biometricConfidence]);

    const chartData = {
        labels: ['Safe', 'Risk'],
        datasets: [
            {
                data: riskMetrics ? [100 - riskMetrics.riskScore, riskMetrics.riskScore] : [0, 0],
                backgroundColor: ['#4caf50', '#f44336'],
                borderColor: ['#43a047', '#e53935'],
                borderWidth: 1,
            },
        ],
    };

    const getRiskLevel = (score: number) => {
        if (score < 30) return { level: 'Low', color: '#4caf50' };
        if (score < 70) return { level: 'Medium', color: '#ff9800' };
        return { level: 'High', color: '#f44336' };
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!riskMetrics) {
        return (
            <Alert severity="error">
                Failed to assess transaction risk. Please try again.
            </Alert>
        );
    }

    const riskLevel = getRiskLevel(riskMetrics.riskScore);

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    AI Risk Assessment
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Risk Score
                        </Typography>
                        <Box sx={{ width: 200, height: 200, margin: 'auto' }}>
                            <Doughnut data={chartData} />
                        </Box>
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Risk Analysis
                        </Typography>
                        <Typography 
                            variant="h4" 
                            sx={{ color: riskLevel.color, mb: 2 }}
                        >
                            {riskLevel.level}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            Anomaly Score: {riskMetrics.anomalyScore.toFixed(2)}%
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Biometric Confidence: {biometricConfidence.toFixed(2)}%
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        AI Recommendations
                    </Typography>
                    {riskMetrics.recommendations.map((rec, index) => (
                        <Alert 
                            key={index} 
                            severity={riskMetrics.riskScore > 70 ? "warning" : "info"}
                            sx={{ mb: 1 }}
                        >
                            {rec}
                        </Alert>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};
