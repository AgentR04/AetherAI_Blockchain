"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnomalyDetector = void 0;
class AnomalyDetector {
    constructor() {
        this.ANOMALY_THRESHOLD = 0.85;
        this.historicalPatterns = new Map();
    }
    detectAnomalies(currentPattern, historicalData) {
        const anomalies = [];
        // Check for amount anomalies
        if (this.isAmountAnomaly(currentPattern.amount, historicalData)) {
            anomalies.push({
                type: 'amount',
                severity: this.calculateSeverity(currentPattern.amount, historicalData),
                details: 'Unusual transaction amount detected'
            });
        }
        // Check for timing anomalies
        if (this.isTimingAnomaly(currentPattern.timestamp, historicalData)) {
            anomalies.push({
                type: 'timing',
                severity: 0.7,
                details: 'Unusual transaction timing detected'
            });
        }
        // Check for behavioral anomalies
        if (this.isBehavioralAnomaly(currentPattern, historicalData)) {
            anomalies.push({
                type: 'behavioral',
                severity: 0.9,
                details: 'Unusual transaction behavior pattern detected'
            });
        }
        return anomalies;
    }
    isAmountAnomaly(amount, historicalData) {
        if (!historicalData.patterns || historicalData.patterns.length === 0) {
            return false;
        }
        const amounts = historicalData.patterns.map((p) => p.amount);
        const mean = this.calculateMean(amounts);
        const stdDev = this.calculateStdDev(amounts, mean);
        // Check if amount is more than 2 standard deviations from mean
        return Math.abs(amount - mean) > (2 * stdDev);
    }
    isTimingAnomaly(timestamp, historicalData) {
        if (!historicalData.patterns || historicalData.patterns.length === 0) {
            return false;
        }
        const hour = new Date(timestamp).getHours();
        const userActiveHours = this.getUserActiveHours(historicalData.patterns);
        // Check if transaction is outside normal active hours
        return !userActiveHours.includes(hour);
    }
    isBehavioralAnomaly(currentPattern, historicalData) {
        if (!historicalData.patterns || historicalData.patterns.length === 0) {
            return false;
        }
        // Calculate behavior score based on multiple factors
        const behaviorScore = this.calculateBehaviorScore(currentPattern, historicalData.patterns);
        return behaviorScore > this.ANOMALY_THRESHOLD;
    }
    calculateMean(values) {
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }
    calculateStdDev(values, mean) {
        const squareDiffs = values.map(value => {
            const diff = value - mean;
            return diff * diff;
        });
        const avgSquareDiff = this.calculateMean(squareDiffs);
        return Math.sqrt(avgSquareDiff);
    }
    getUserActiveHours(patterns) {
        const hourCounts = new Map();
        patterns.forEach(pattern => {
            const hour = new Date(pattern.timestamp).getHours();
            hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
        });
        // Return hours with significant activity
        return Array.from(hourCounts.entries())
            .filter(([_, count]) => count > patterns.length * 0.1)
            .map(([hour, _]) => hour);
    }
    calculateBehaviorScore(current, historical) {
        let score = 0;
        // Check transaction frequency
        const recentTransactions = historical.filter(tx => tx.timestamp > Date.now() - 24 * 60 * 60 * 1000).length;
        if (recentTransactions > historical.length / 7) { // More than daily average
            score += 0.3;
        }
        // Check new receivers
        const knownReceivers = new Set(historical.map(tx => tx.receiver));
        if (!knownReceivers.has(current.receiver)) {
            score += 0.2;
        }
        // Check gas usage pattern
        const avgGas = this.calculateMean(historical.map(tx => parseInt(tx.gasUsed)));
        const currentGas = parseInt(current.gasUsed);
        if (currentGas > avgGas * 1.5) {
            score += 0.3;
        }
        return score;
    }
    calculateSeverity(amount, historicalData) {
        const amounts = historicalData.patterns.map((p) => p.amount);
        const mean = this.calculateMean(amounts);
        const stdDev = this.calculateStdDev(amounts, mean);
        const deviations = Math.abs(amount - mean) / stdDev;
        // Calculate severity based on number of standard deviations
        return Math.min(1, deviations / 5);
    }
}
exports.AnomalyDetector = AnomalyDetector;
