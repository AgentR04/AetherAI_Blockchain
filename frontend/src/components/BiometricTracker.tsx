import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface BiometricData {
    keystrokePattern: number[];
    mouseMovement: [number, number][];
    transactionTiming: number;
}

interface BiometricTrackerProps {
    onBiometricDataCollected: (data: BiometricData) => void;
}

export const BiometricTracker: React.FC<BiometricTrackerProps> = ({ onBiometricDataCollected }) => {
    const [keystrokeTimings, setKeystrokeTimings] = useState<number[]>([]);
    const [mousePositions, setMousePositions] = useState<[number, number][]>([]);
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [confidence, setConfidence] = useState<number>(0);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            setKeystrokeTimings(prev => [...prev, Date.now()]);
        };

        const handleMouseMove = (e: MouseEvent) => {
            setMousePositions(prev => [...prev, [e.clientX, e.clientY]]);
        };

        window.addEventListener('keypress', handleKeyPress);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('keypress', handleKeyPress);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        // Calculate biometric confidence based on user interaction
        const calculateConfidence = () => {
            const keystrokeScore = Math.min(keystrokeTimings.length / 20, 1);
            const mouseScore = Math.min(mousePositions.length / 50, 1);
            const timeScore = Math.min((Date.now() - startTime) / 5000, 1);
            
            const newConfidence = ((keystrokeScore + mouseScore + timeScore) / 3) * 100;
            setConfidence(newConfidence);

            if (newConfidence >= 70) {
                onBiometricDataCollected({
                    keystrokePattern: keystrokeTimings,
                    mouseMovement: mousePositions,
                    transactionTiming: Date.now() - startTime
                });
            }
        };

        const interval = setInterval(calculateConfidence, 500);
        return () => clearInterval(interval);
    }, [keystrokeTimings, mousePositions, startTime, onBiometricDataCollected]);

    return (
        <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>
                Behavioral Biometric Authentication
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Continue interacting naturally while we verify your identity...
            </Typography>
            <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress 
                    variant="determinate" 
                    value={confidence} 
                    sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: confidence >= 70 ? '#4caf50' : '#2196f3'
                        }
                    }}
                />
                <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    align="center" 
                    sx={{ mt: 1 }}
                >
                    Confidence: {Math.round(confidence)}%
                </Typography>
            </Box>
        </Box>
    );
};
