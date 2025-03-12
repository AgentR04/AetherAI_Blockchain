import * as tf from '@tensorflow/tfjs-node';
import { BiometricData } from '../biometrics';

export interface TransactionFeatures {
    amount: number;
    historicalVolume: number;
    avgTransactionSize: number;
    recipientTrustScore: number;
    biometricConfidence: number;
    timeOfDay: number;
    dayOfWeek: number;
}

export interface LiquidityFeatures {
    poolDepth: number;
    volatility: number;
    volume24h: number;
    currentPrice: number;
    priceChange24h: number;
}

export class RiskAssessmentModel {
    private model: tf.LayersModel | null = null;

    async initialize(): Promise<void> {
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

    async predict(features: TransactionFeatures): Promise<number> {
        if (!this.model) {
            await this.initialize();
        }

        // Normalize features
        const normalizedFeatures = this.normalizeFeatures(features);
        
        // Convert to tensor
        const inputTensor = tf.tensor2d([Object.values(normalizedFeatures)]);
        
        // Make prediction
        const prediction = await this.model!.predict(inputTensor) as tf.Tensor;
        const riskScore = (await prediction.data())[0];
        
        // Cleanup
        inputTensor.dispose();
        prediction.dispose();
        
        return riskScore;
    }

    private normalizeFeatures(features: TransactionFeatures): TransactionFeatures {
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

export class AnomalyDetector {
    private readonly ANOMALY_THRESHOLD = 3.0; // Standard deviations

    detectAnomalies(features: TransactionFeatures, history: TransactionFeatures[]): number {
        if (history.length < 2) return 0;

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

    private calculateZScore(value: number, history: number[]): number {
        const mean = history.reduce((a, b) => a + b) / history.length;
        const stdDev = Math.sqrt(
            history.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / (history.length - 1)
        );
        return stdDev === 0 ? 0 : Math.abs(value - mean) / stdDev;
    }
}

export class LiquidityOptimizer {
    private model: tf.LayersModel | null = null;

    async initialize(): Promise<void> {
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

    async optimizeRange(features: LiquidityFeatures): Promise<{ min: number; max: number }> {
        if (!this.model) {
            await this.initialize();
        }

        // Normalize features
        const normalizedFeatures = this.normalizeFeatures(features);
        
        // Convert to tensor
        const inputTensor = tf.tensor2d([Object.values(normalizedFeatures)]);
        
        // Make prediction
        const prediction = await this.model!.predict(inputTensor) as tf.Tensor;
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

    private normalizeFeatures(features: LiquidityFeatures): LiquidityFeatures {
        return {
            poolDepth: features.poolDepth / 1000000, // Normalize to 0-1 range
            volatility: features.volatility, // Already 0-1
            volume24h: features.volume24h / features.poolDepth,
            currentPrice: features.currentPrice / 1000,
            priceChange24h: (features.priceChange24h + 1) / 2 // Convert from -1,1 to 0,1
        };
    }
}
