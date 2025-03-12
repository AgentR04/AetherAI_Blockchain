import { TransactionFeatures } from './RiskAssessmentModel';

interface Anomaly {
    type: string;
    severity: number;
    details: string;
}

export class AnomalyDetector {
    private readonly ANOMALY_THRESHOLD = 0.85;

    detectAnomalies(currentFeatures: TransactionFeatures, historicalFeatures: TransactionFeatures): Anomaly[] {
        const anomalies: Anomaly[] = [];
        
        // Check for amount anomalies
        if (this.isAmountAnomaly(currentFeatures)) {
            anomalies.push({
                type: 'amount',
                severity: this.calculateSeverity(currentFeatures),
                details: 'Unusual transaction amount detected'
            });
        }

        // Check for timing anomalies
        if (this.isTimingAnomaly(currentFeatures)) {
            anomalies.push({
                type: 'timing',
                severity: 0.7,
                details: 'Unusual transaction timing detected'
            });
        }

        // Check for behavioral anomalies
        if (this.isBehavioralAnomaly(currentFeatures, historicalFeatures)) {
            anomalies.push({
                type: 'behavioral',
                severity: 0.9,
                details: 'Unusual transaction behavior pattern detected'
            });
        }

        return anomalies;
    }

    private isAmountAnomaly(features: TransactionFeatures): boolean {
        if (features.historicalVolume === 0) {
            return false;
        }

        // Check if amount is significantly larger than average
        return features.amount > features.avgTransactionSize * 2;
    }

    private isTimingAnomaly(features: TransactionFeatures): boolean {
        // Check if transaction is outside normal hours (e.g., very late at night)
        const hour = features.timeOfDay;
        return hour < 6 || hour > 22; // Flagging transactions between 10 PM and 6 AM
    }

    private isBehavioralAnomaly(current: TransactionFeatures, historical: TransactionFeatures): boolean {
        // Calculate behavior score based on multiple factors
        let score = 0;

        // Large deviation from historical average
        if (current.amount > historical.avgTransactionSize * 3) {
            score += 0.4;
        }

        // Low biometric confidence
        if (current.biometricConfidence < 0.7) {
            score += 0.3;
        }

        // Low recipient trust score
        if (current.recipientTrustScore < 0.5) {
            score += 0.3;
        }

        return score > this.ANOMALY_THRESHOLD;
    }

    private calculateSeverity(features: TransactionFeatures): number {
        // Calculate severity based on amount deviation and other factors
        const amountDeviation = features.amount / features.avgTransactionSize;
        const severityScore = Math.min(1, amountDeviation / 5);

        // Increase severity if biometric confidence is low
        if (features.biometricConfidence < 0.7) {
            return Math.min(1, severityScore + 0.2);
        }

        return severityScore;
    }
}
