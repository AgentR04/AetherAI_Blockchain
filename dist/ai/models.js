"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidityOptimizer = exports.AnomalyDetector = exports.RiskAssessmentModel = void 0;
const tf = __importStar(require("@tensorflow/tfjs-node"));
class RiskAssessmentModel {
    constructor() {
        this.model = null;
    }
    async initialize() {
        // Define model architecture
        const model = tf.sequential();
        // Input layer for transaction features
        model.add(tf.layers.dense({
            inputShape: [7], // Number of features
            units: 32,
            activation: 'relu'
        }));
        // Hidden layers
        model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
        model.add(tf.layers.dropout({ rate: 0.2 }));
        // Output layer for risk score
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
        model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });
        this.model = model;
    }
    async predict(features) {
        if (!this.model) {
            await this.initialize();
        }
        // Normalize features
        const normalizedFeatures = this.normalizeFeatures(features);
        // Convert to tensor
        const inputTensor = tf.tensor2d([Object.values(normalizedFeatures)]);
        // Make prediction
        const prediction = await this.model.predict(inputTensor);
        const riskScore = (await prediction.data())[0];
        // Cleanup
        inputTensor.dispose();
        prediction.dispose();
        return riskScore;
    }
    normalizeFeatures(features) {
        return {
            amount: features.amount / 10000, // Normalize to 0-1 range
            historicalVolume: features.historicalVolume / 100000,
            avgTransactionSize: features.avgTransactionSize / 1000,
            recipientTrustScore: features.recipientTrustScore, // Already 0-1
            biometricConfidence: features.biometricConfidence, // Already 0-1
            timeOfDay: features.timeOfDay / 24, // 0-1
            dayOfWeek: features.dayOfWeek / 7 // 0-1
        };
    }
}
exports.RiskAssessmentModel = RiskAssessmentModel;
class AnomalyDetector {
    constructor() {
        this.ANOMALY_THRESHOLD = 3.0; // Standard deviations
    }
    detectAnomalies(features, history) {
        if (history.length < 2)
            return 0;
        // Calculate z-scores for each feature
        const zScores = {
            amount: this.calculateZScore(features.amount, history.map(h => h.amount)),
            volume: this.calculateZScore(features.historicalVolume, history.map(h => h.historicalVolume)),
            avgSize: this.calculateZScore(features.avgTransactionSize, history.map(h => h.avgTransactionSize))
        };
        // Calculate anomaly score as max z-score
        const maxZScore = Math.max(...Object.values(zScores));
        // Normalize to 0-1 range
        return Math.min(maxZScore / this.ANOMALY_THRESHOLD, 1);
    }
    calculateZScore(value, history) {
        const mean = history.reduce((a, b) => a + b) / history.length;
        const stdDev = Math.sqrt(history.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / (history.length - 1));
        return stdDev === 0 ? 0 : Math.abs(value - mean) / stdDev;
    }
}
exports.AnomalyDetector = AnomalyDetector;
class LiquidityOptimizer {
    constructor() {
        this.model = null;
    }
    async initialize() {
        const model = tf.sequential();
        // Input layer for liquidity features
        model.add(tf.layers.dense({
            inputShape: [5], // Number of features
            units: 32,
            activation: 'relu'
        }));
        // Hidden layers
        model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
        model.add(tf.layers.dropout({ rate: 0.2 }));
        // Output layer for optimal range
        model.add(tf.layers.dense({ units: 2, activation: 'sigmoid' }));
        model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'meanSquaredError',
            metrics: ['accuracy']
        });
        this.model = model;
    }
    async optimizeRange(features) {
        if (!this.model) {
            await this.initialize();
        }
        // Normalize features
        const normalizedFeatures = this.normalizeFeatures(features);
        // Convert to tensor
        const inputTensor = tf.tensor2d([Object.values(normalizedFeatures)]);
        // Make prediction
        const prediction = await this.model.predict(inputTensor);
        const [min, max] = await prediction.data();
        // Cleanup
        inputTensor.dispose();
        prediction.dispose();
        // Denormalize to actual pool values
        return {
            min: min * features.poolDepth,
            max: max * features.poolDepth
        };
    }
    normalizeFeatures(features) {
        return {
            poolDepth: features.poolDepth / 1000000, // Normalize to 0-1 range
            volatility: features.volatility, // Already 0-1
            volume24h: features.volume24h / features.poolDepth,
            currentPrice: features.currentPrice / 1000,
            priceChange24h: (features.priceChange24h + 1) / 2 // Convert from -1,1 to 0,1
        };
    }
}
exports.LiquidityOptimizer = LiquidityOptimizer;
