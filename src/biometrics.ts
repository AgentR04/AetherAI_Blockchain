import { AptosClient, AptosAccount, CoinClient, FaucetClient } from "aptos";
import { createHash } from 'crypto';

export interface KeystrokePattern {
    key: string;
    pressTime: number;
    releaseTime: number;
}

export interface MouseMovement {
    x: number;
    y: number;
    timestamp: number;
    velocity: number;
    acceleration: number;
}

export interface TransactionTiming {
    startTime: number;
    confirmTime: number;
    totalDuration: number;
}

export interface BiometricData {
    keystrokePatterns: KeystrokePattern[];
    mouseMovements: MouseMovement[];
    transactionTiming: TransactionTiming[];
}

export class BiometricVerifier {
    private static readonly SIMILARITY_THRESHOLD = 0.85;
    private static readonly ANOMALY_THRESHOLD = 0.75;
    private static readonly MIN_PATTERNS_REQUIRED = 5;

    // Weights for different biometric factors
    private static readonly WEIGHTS = {
        keystroke: 0.4,
        mouse: 0.3,
        timing: 0.3
    };

    constructor(private nodeUrl: string) {}

    // Main verification method
    public async verifyBehavior(currentData: BiometricData): Promise<boolean> {
        try {
            // Validate input data
            if (!this.validateBiometricData(currentData)) {
                console.error("Invalid biometric data format");
                return false;
            }

            // Calculate individual similarity scores
            const keystrokeSimilarity = this.analyzeKeystrokePatterns(currentData.keystrokePatterns);
            const mouseSimilarity = this.analyzeMousePatterns(currentData.mouseMovements);
            const timingSimilarity = this.analyzeTransactionTiming(currentData.transactionTiming);

            // Calculate weighted average
            const overallSimilarity = 
                (keystrokeSimilarity * BiometricVerifier.WEIGHTS.keystroke) +
                (mouseSimilarity * BiometricVerifier.WEIGHTS.mouse) +
                (timingSimilarity * BiometricVerifier.WEIGHTS.timing);

            return overallSimilarity >= BiometricVerifier.SIMILARITY_THRESHOLD;
        } catch (error) {
            console.error("Error in behavior verification:", error);
            return false;
        }
    }

    // Generate biometric hash for blockchain storage
    public generateBiometricHash(data: BiometricData): Uint8Array {
        const serializedData = JSON.stringify({
            keystrokeHash: this.hashKeystrokePatterns(data.keystrokePatterns),
            mouseHash: this.hashMousePatterns(data.mouseMovements),
            timingHash: this.hashTransactionTiming(data.transactionTiming)
        });

        return new Uint8Array(
            createHash('sha256')
                .update(serializedData)
                .digest()
        );
    }

    // Validate biometric data format
    private validateBiometricData(data: BiometricData): boolean {
        return (
            Array.isArray(data.keystrokePatterns) &&
            data.keystrokePatterns.length >= BiometricVerifier.MIN_PATTERNS_REQUIRED &&
            Array.isArray(data.mouseMovements) &&
            data.mouseMovements.length >= BiometricVerifier.MIN_PATTERNS_REQUIRED &&
            Array.isArray(data.transactionTiming) &&
            data.transactionTiming.length > 0
        );
    }

    // Analyze keystroke patterns
    private analyzeKeystrokePatterns(patterns: KeystrokePattern[]): number {
        if (patterns.length < BiometricVerifier.MIN_PATTERNS_REQUIRED) return 0;

        // Calculate typing rhythm consistency
        const rhythmScores = patterns.map((pattern, i) => {
            if (i === 0) return 1;
            const prevPattern = patterns[i - 1];
            const currentInterval = pattern.pressTime - prevPattern.releaseTime;
            const holdTime = pattern.releaseTime - pattern.pressTime;
            
            // Score based on consistency of intervals and hold times
            return this.calculateRhythmScore(currentInterval, holdTime);
        });

        return this.normalizeScore(
            rhythmScores.reduce((a, b) => a + b) / rhythmScores.length
        );
    }

    // Analyze mouse movement patterns
    private analyzeMousePatterns(movements: MouseMovement[]): number {
        if (movements.length < BiometricVerifier.MIN_PATTERNS_REQUIRED) return 0;

        // Calculate movement smoothness and consistency
        const movementScores = movements.map((movement, i) => {
            if (i === 0) return 1;
            const prevMovement = movements[i - 1];
            
            // Score based on velocity consistency and movement smoothness
            return this.calculateMovementScore(
                movement,
                prevMovement
            );
        });

        return this.normalizeScore(
            movementScores.reduce((a, b) => a + b) / movementScores.length
        );
    }

    // Analyze transaction timing patterns
    private analyzeTransactionTiming(timings: TransactionTiming[]): number {
        if (timings.length === 0) return 0;

        // Calculate timing consistency
        const timingScores = timings.map(timing => {
            const efficiency = timing.totalDuration > 0 ? 
                (timing.confirmTime - timing.startTime) / timing.totalDuration : 0;
            
            return this.calculateTimingScore(efficiency);
        });

        return this.normalizeScore(
            timingScores.reduce((a, b) => a + b) / timingScores.length
        );
    }

    // Helper methods for pattern analysis
    private calculateRhythmScore(interval: number, holdTime: number): number {
        // Penalize extremely short or long intervals/hold times
        const intervalScore = Math.exp(-Math.abs(interval - 200) / 200);
        const holdScore = Math.exp(-Math.abs(holdTime - 100) / 100);
        
        return (intervalScore + holdScore) / 2;
    }

    private calculateMovementScore(
        current: MouseMovement,
        previous: MouseMovement
    ): number {
        // Score based on movement smoothness
        const velocityChange = Math.abs(current.velocity - previous.velocity);
        const accelerationChange = Math.abs(current.acceleration - previous.acceleration);
        
        const velocityScore = Math.exp(-velocityChange / 1000);
        const accelerationScore = Math.exp(-accelerationChange / 500);
        
        return (velocityScore + accelerationScore) / 2;
    }

    private calculateTimingScore(efficiency: number): number {
        // Penalize extremely fast or slow transactions
        return Math.exp(-Math.abs(efficiency - 0.7) / 0.3);
    }

    // Hashing methods for blockchain storage
    private hashKeystrokePatterns(patterns: KeystrokePattern[]): string {
        const serialized = patterns.map(p => 
            `${p.key}:${p.pressTime}:${p.releaseTime}`
        ).join('|');
        return createHash('sha256').update(serialized).digest('hex');
    }

    private hashMousePatterns(movements: MouseMovement[]): string {
        const serialized = movements.map(m => 
            `${m.x}:${m.y}:${m.timestamp}:${m.velocity}:${m.acceleration}`
        ).join('|');
        return createHash('sha256').update(serialized).digest('hex');
    }

    private hashTransactionTiming(timings: TransactionTiming[]): string {
        const serialized = timings.map(t => 
            `${t.startTime}:${t.confirmTime}:${t.totalDuration}`
        ).join('|');
        return createHash('sha256').update(serialized).digest('hex');
    }

    // Normalize scores to [0, 1] range
    private normalizeScore(score: number): number {
        return Math.max(0, Math.min(1, score));
    }
}
