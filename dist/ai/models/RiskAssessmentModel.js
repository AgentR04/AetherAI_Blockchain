"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskAssessmentModel = void 0;
class RiskAssessmentModel {
    constructor() {
        this.MIN_CONFIDENCE = 0.6;
        // Initialize model
    }
    async initialize() {
        // Load model weights and configuration
        await this.loadModel();
    }
    async loadModel() {
        // Load pre-trained model weights
        // This would load a real ML model in production
    }
    async predict(features) {
        // Normalize features
        const normalizedFeatures = this.normalizeFeatures(features);
        // Calculate risk score based on features
        const riskScore = this.calculateRiskScore(normalizedFeatures);
        // Apply biometric confidence adjustment
        return this.adjustRiskScore(riskScore, features.biometricConfidence);
    }
    normalizeFeatures(features) {
        return {
            amount: features.amount / features.historicalVolume,
            sizeDeviation: Math.abs(features.amount - features.avgTransactionSize) / features.avgTransactionSize,
            trustScore: features.recipientTrustScore,
            timeFeature: Math.sin((2 * Math.PI * features.timeOfDay) / 24),
            dayFeature: Math.sin((2 * Math.PI * features.dayOfWeek) / 7),
            biometricConfidence: features.biometricConfidence
        };
    }
    calculateRiskScore(normalizedFeatures) {
        // Calculate base risk score using normalized features
        let riskScore = 0;
        // Higher risk for large deviations from average transaction size
        riskScore += normalizedFeatures.sizeDeviation * 0.3;
        // Lower risk for trusted recipients
        riskScore -= normalizedFeatures.trustScore * 0.2;
        // Adjust for time-based patterns
        const timeRisk = (1 + normalizedFeatures.timeFeature) * 0.1;
        const dayRisk = (1 + normalizedFeatures.dayFeature) * 0.1;
        riskScore += timeRisk + dayRisk;
        // Ensure risk score is between 0 and 1
        return Math.max(0, Math.min(1, riskScore));
    }
    adjustRiskScore(baseRisk, biometricConfidence) {
        if (biometricConfidence < this.MIN_CONFIDENCE) {
            // Increase risk if biometric confidence is low
            return Math.min(1, baseRisk + (this.MIN_CONFIDENCE - biometricConfidence));
        }
        return baseRisk;
    }
    async updateModel(newPatterns) {
        // Update model with new transaction patterns
        // This would retrain or fine-tune the model in production
    }
}
exports.RiskAssessmentModel = RiskAssessmentModel;
