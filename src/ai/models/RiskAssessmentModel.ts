export interface TransactionFeatures {
    amount: number;
    historicalVolume: number;
    avgTransactionSize: number;
    recipientTrustScore: number;
    biometricConfidence: number;
    timeOfDay: number;
    dayOfWeek: number;
}

interface ModelWeights {
    amount: number;
    volume: number;
    trust: number;
    biometric: number;
    timing: number;
}

export class RiskAssessmentModel {
    private weights: ModelWeights;
    private readonly MIN_CONFIDENCE = 0.3;
    private readonly MAX_RISK_SCORE = 1.0;

    constructor() {
        this.weights = {
            amount: 0.3,
            volume: 0.2,
            trust: 0.2,
            biometric: 0.2,
            timing: 0.1
        };
    }

    async predict(features: TransactionFeatures): Promise<number> {
        const normalizedFeatures = this.normalizeFeatures(features);
        const riskScore = this.calculateRiskScore(normalizedFeatures);

        // Adjust risk score based on biometric confidence
        return this.adjustForBiometricConfidence(riskScore, features.biometricConfidence);
    }

    async updateModel(patterns: TransactionFeatures[]): Promise<void> {
        if (!patterns.length) {
            return;
        }

        // Update weights based on new transaction patterns
        const updatedWeights = this.calculateNewWeights(patterns);
        this.weights = updatedWeights;
    }

    private normalizeFeatures(features: TransactionFeatures): TransactionFeatures {
        return {
            amount: this.normalizeAmount(features.amount),
            historicalVolume: this.normalizeVolume(features.historicalVolume),
            avgTransactionSize: this.normalizeAmount(features.avgTransactionSize),
            recipientTrustScore: features.recipientTrustScore,
            biometricConfidence: features.biometricConfidence,
            timeOfDay: features.timeOfDay / 24, // Normalize to [0,1]
            dayOfWeek: features.dayOfWeek / 6 // Normalize to [0,1]
        };
    }

    private normalizeAmount(amount: number): number {
        // Normalize amount using log scale to handle large ranges
        if (amount <= 0) return 0;
        const normalizedAmount = Math.log10(amount) / 10; // Assuming most transactions are under 10^10
        return Math.min(1, normalizedAmount);
    }

    private normalizeVolume(volume: number): number {
        if (volume <= 0) return 0;
        const normalizedVolume = Math.log10(volume) / 12; // Assuming daily volume under 10^12
        return Math.min(1, normalizedVolume);
    }

    private calculateRiskScore(features: TransactionFeatures): number {
        let score = 0;

        // Amount-based risk
        score += this.weights.amount * features.amount;

        // Volume-based risk
        score += this.weights.volume * features.historicalVolume;

        // Trust-based risk
        score += this.weights.trust * (1 - features.recipientTrustScore);

        // Time-based risk (higher risk during unusual hours)
        const timingRisk = this.calculateTimingRisk(features.timeOfDay, features.dayOfWeek);
        score += this.weights.timing * timingRisk;

        return Math.min(this.MAX_RISK_SCORE, score);
    }

    private calculateTimingRisk(hour: number, day: number): number {
        // Higher risk for transactions during unusual hours (night)
        const hourRisk = (hour < 6 || hour > 22) ? 0.8 : 0.2;

        // Higher risk for transactions during weekends
        const dayRisk = (day === 0 || day === 6) ? 0.7 : 0.3;

        return (hourRisk + dayRisk) / 2;
    }

    private adjustForBiometricConfidence(riskScore: number, biometricConfidence: number): number {
        if (biometricConfidence < this.MIN_CONFIDENCE) {
            // Increase risk score for low biometric confidence
            return Math.min(this.MAX_RISK_SCORE, riskScore + (1 - biometricConfidence));
        }
        return riskScore;
    }

    private calculateNewWeights(patterns: TransactionFeatures[]): ModelWeights {
        // This would implement actual weight updating logic based on patterns
        // For now, we keep weights static
        return { ...this.weights };
    }
}
