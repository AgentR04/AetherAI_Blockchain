"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiometricVerifier = void 0;
const crypto_1 = require("crypto");
class BiometricVerifier {
    constructor(nodeUrl) {
        this.nodeUrl = nodeUrl;
    }
    // Main verification method
    async verifyBehavior(currentData) {
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
            const overallSimilarity = (keystrokeSimilarity * BiometricVerifier.WEIGHTS.keystroke) +
                (mouseSimilarity * BiometricVerifier.WEIGHTS.mouse) +
                (timingSimilarity * BiometricVerifier.WEIGHTS.timing);
            return overallSimilarity >= BiometricVerifier.SIMILARITY_THRESHOLD;
        }
        catch (error) {
            console.error("Error in behavior verification:", error);
            return false;
        }
    }
    // Generate biometric hash for blockchain storage
    generateBiometricHash(data) {
        const serializedData = JSON.stringify({
            keystrokeHash: this.hashKeystrokePatterns(data.keystrokePatterns),
            mouseHash: this.hashMousePatterns(data.mouseMovements),
            timingHash: this.hashTransactionTiming(data.transactionTiming)
        });
        return new Uint8Array((0, crypto_1.createHash)('sha256')
            .update(serializedData)
            .digest());
    }
    // Validate biometric data format
    validateBiometricData(data) {
        return (Array.isArray(data.keystrokePatterns) &&
            data.keystrokePatterns.length >= BiometricVerifier.MIN_PATTERNS_REQUIRED &&
            Array.isArray(data.mouseMovements) &&
            data.mouseMovements.length >= BiometricVerifier.MIN_PATTERNS_REQUIRED &&
            Array.isArray(data.transactionTiming) &&
            data.transactionTiming.length > 0);
    }
    // Analyze keystroke patterns
    analyzeKeystrokePatterns(patterns) {
        if (patterns.length < BiometricVerifier.MIN_PATTERNS_REQUIRED)
            return 0;
        // Calculate typing rhythm consistency
        const rhythmScores = patterns.map((pattern, i) => {
            if (i === 0)
                return 1;
            const prevPattern = patterns[i - 1];
            const currentInterval = pattern.pressTime - prevPattern.releaseTime;
            const holdTime = pattern.releaseTime - pattern.pressTime;
            // Score based on consistency of intervals and hold times
            return this.calculateRhythmScore(currentInterval, holdTime);
        });
        return this.normalizeScore(rhythmScores.reduce((a, b) => a + b) / rhythmScores.length);
    }
    // Analyze mouse movement patterns
    analyzeMousePatterns(movements) {
        if (movements.length < BiometricVerifier.MIN_PATTERNS_REQUIRED)
            return 0;
        // Calculate movement smoothness and consistency
        const movementScores = movements.map((movement, i) => {
            if (i === 0)
                return 1;
            const prevMovement = movements[i - 1];
            // Score based on velocity consistency and movement smoothness
            return this.calculateMovementScore(movement, prevMovement);
        });
        return this.normalizeScore(movementScores.reduce((a, b) => a + b) / movementScores.length);
    }
    // Analyze transaction timing patterns
    analyzeTransactionTiming(timings) {
        if (timings.length === 0)
            return 0;
        // Calculate timing consistency
        const timingScores = timings.map(timing => {
            const efficiency = timing.totalDuration > 0 ?
                (timing.confirmTime - timing.startTime) / timing.totalDuration : 0;
            return this.calculateTimingScore(efficiency);
        });
        return this.normalizeScore(timingScores.reduce((a, b) => a + b) / timingScores.length);
    }
    // Helper methods for pattern analysis
    calculateRhythmScore(interval, holdTime) {
        // Penalize extremely short or long intervals/hold times
        const intervalScore = Math.exp(-Math.abs(interval - 200) / 200);
        const holdScore = Math.exp(-Math.abs(holdTime - 100) / 100);
        return (intervalScore + holdScore) / 2;
    }
    calculateMovementScore(current, previous) {
        // Score based on movement smoothness
        const velocityChange = Math.abs(current.velocity - previous.velocity);
        const accelerationChange = Math.abs(current.acceleration - previous.acceleration);
        const velocityScore = Math.exp(-velocityChange / 1000);
        const accelerationScore = Math.exp(-accelerationChange / 500);
        return (velocityScore + accelerationScore) / 2;
    }
    calculateTimingScore(efficiency) {
        // Penalize extremely fast or slow transactions
        return Math.exp(-Math.abs(efficiency - 0.7) / 0.3);
    }
    // Hashing methods for blockchain storage
    hashKeystrokePatterns(patterns) {
        const serialized = patterns.map(p => `${p.key}:${p.pressTime}:${p.releaseTime}`).join('|');
        return (0, crypto_1.createHash)('sha256').update(serialized).digest('hex');
    }
    hashMousePatterns(movements) {
        const serialized = movements.map(m => `${m.x}:${m.y}:${m.timestamp}:${m.velocity}:${m.acceleration}`).join('|');
        return (0, crypto_1.createHash)('sha256').update(serialized).digest('hex');
    }
    hashTransactionTiming(timings) {
        const serialized = timings.map(t => `${t.startTime}:${t.confirmTime}:${t.totalDuration}`).join('|');
        return (0, crypto_1.createHash)('sha256').update(serialized).digest('hex');
    }
    // Normalize scores to [0, 1] range
    normalizeScore(score) {
        return Math.max(0, Math.min(1, score));
    }
}
exports.BiometricVerifier = BiometricVerifier;
BiometricVerifier.SIMILARITY_THRESHOLD = 0.85;
BiometricVerifier.ANOMALY_THRESHOLD = 0.75;
BiometricVerifier.MIN_PATTERNS_REQUIRED = 5;
// Weights for different biometric factors
BiometricVerifier.WEIGHTS = {
    keystroke: 0.4,
    mouse: 0.3,
    timing: 0.3
};
