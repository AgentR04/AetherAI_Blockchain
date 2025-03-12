import { AptosClient, AptosAccount, Types, HexString } from "aptos";
import { BiometricVerifier } from "./biometrics";
import { RiskAssessmentModel, AnomalyDetector, LiquidityOptimizer } from './ai/models';
import { MoveAIAgent } from './ai/agents';

// AI-Powered DeFi Types
interface RiskAssessment {
    riskScore: number;
    anomalyScore: number;
    recommendations: string[];
    timestamp: number;
}

interface LiquidityMetrics {
    poolDepth: number;
    volatility: number;
    volume24h: number;
    currentPrice: number;
    priceChange24h: number;
    optimalRange: {
        min: number;
        max: number;
    };
}

export class DeFiAgent {
    private aptosClient: AptosClient;
    private biometricVerifier: BiometricVerifier;
    private moduleAddress: string;
    private riskModel: RiskAssessmentModel;
    private anomalyDetector: AnomalyDetector;
    private liquidityOptimizer: LiquidityOptimizer;
    private moveAIAgent: MoveAIAgent;
    private readonly RISK_THRESHOLD = 0.75;
    private readonly MIN_LIQUIDITY_DEPTH = 1000;

    constructor(
        nodeUrl: string,
        moduleAddress: string,
        riskModel: RiskAssessmentModel,
        anomalyDetector: AnomalyDetector,
        liquidityOptimizer: LiquidityOptimizer,
        biometricVerifier: BiometricVerifier
    ) {
        this.aptosClient = new AptosClient(nodeUrl);
        this.biometricVerifier = biometricVerifier;
        this.moduleAddress = moduleAddress;
        
        // Initialize AI components
        this.riskModel = riskModel;
        this.anomalyDetector = anomalyDetector;
        this.liquidityOptimizer = liquidityOptimizer;
        this.moveAIAgent = new MoveAIAgent(nodeUrl, moduleAddress, riskModel, anomalyDetector, liquidityOptimizer, biometricVerifier);
    }

    async initialize(): Promise<void> {
        // Initialize all AI models and agents
        await Promise.all([
            this.riskModel.initialize(),
            this.liquidityOptimizer.initialize(),
            this.moveAIAgent.initialize()
        ]);
    }

    // AI-powered risk assessment
    private async assessTransactionRisk(
        fromAddress: string,
        toAddress: string,
        amount: number,
        biometricData: any
    ): Promise<RiskAssessment> {
        try {
            // Get transaction history and features
            const userHistory = await this.getUserTransactionHistory(fromAddress);
            const recipientProfile = await this.getRecipientRiskProfile(toAddress);
            
            // Convert boolean to number (0-1) for biometric confidence
            const biometricConfidence = await this.biometricVerifier.verifyBehavior(biometricData) ? 1.0 : 0.0;
            
            // Prepare features for AI model
            const features = {
                amount,
                historicalVolume: userHistory.totalVolume,
                avgTransactionSize: userHistory.avgAmount,
                recipientTrustScore: recipientProfile.trustScore,
                biometricConfidence,
                timeOfDay: new Date().getHours(),
                dayOfWeek: new Date().getDay()
            };

            // Run AI risk assessment
            const riskScore = await this.riskModel.predict(features);
            const anomalyScore = this.anomalyDetector.detectAnomalies(features, userHistory.patterns);

            // Generate recommendations using Move AI Agent
            const recommendations = await this.generateAIRecommendations(riskScore, anomalyScore, features);

            return {
                riskScore,
                anomalyScore,
                recommendations,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error("Risk assessment failed:", error);
            throw error;
        }
    }

    // AI-driven liquidity optimization
    private async optimizeLiquidity(
        poolAddress: string,
        amount: number
    ): Promise<LiquidityMetrics> {
        try {
            const metrics = await this.analyzeLiquidityPool(poolAddress);
            
            // Use AI to optimize liquidity
            await this.moveAIAgent.optimizeLiquidityPool(poolAddress, metrics);
            
            // Get optimal range from ML model
            const optimalRange = await this.liquidityOptimizer.optimizeRange({
                poolDepth: metrics.poolDepth,
                volatility: metrics.volatility,
                volume24h: metrics.volume24h,
                currentPrice: metrics.currentPrice,
                priceChange24h: metrics.priceChange24h
            });

            return {
                ...metrics,
                optimalRange
            };
        } catch (error) {
            console.error("Liquidity optimization failed:", error);
            throw error;
        }
    }

    // Execute secure transfer with AI risk assessment
    public async executeSecureTransfer(
        fromAccount: AptosAccount,
        toAddress: string,
        amount: number,
        biometricData: any
    ): Promise<boolean> {
        try {
            // AI risk assessment
            const riskAssessment = await this.assessTransactionRisk(
                fromAccount.address().hex(),
                toAddress,
                amount,
                biometricData
            );

            if (riskAssessment.riskScore > this.RISK_THRESHOLD) {
                console.error("High risk transaction detected:", riskAssessment.recommendations);
                return false;
            }

            // Verify biometric data
            const isVerified = await this.biometricVerifier.verifyBehavior(biometricData);
            if (!isVerified) {
                console.error("Biometric verification failed");
                return false;
            }

            // Generate biometric hash
            const biometricHash = this.biometricVerifier.generateBiometricHash(biometricData);

            // Prepare transaction with AI insights
            const payload = {
                function: `${this.moduleAddress}::defi_agent::verify_and_transfer`,
                type_arguments: [],
                arguments: [
                    toAddress,
                    amount.toString(),
                    Array.from(biometricHash),
                    Array.from(Buffer.from(JSON.stringify(riskAssessment)))
                ]
            };

            // Execute transaction
            const transactionHash = await this.submitTransaction(fromAccount, payload);

            // Start AI monitoring of transaction
            await this.moveAIAgent.monitorTransactions(fromAccount);

            // Log metrics
            await this.logTransactionMetrics(
                fromAccount,
                toAddress,
                amount,
                riskAssessment
            );

            return true;
        } catch (error) {
            console.error("Transaction failed:", error);
            return false;
        }
    }

    // AI recommendation generation
    private async generateAIRecommendations(
        riskScore: number,
        anomalyScore: number,
        features: any
    ): Promise<string[]> {
        const recommendations = [];
        
        if (riskScore > 0.7) {
            recommendations.push("High-risk transaction detected. Additional verification recommended.");
        }
        
        if (anomalyScore > 0.5) {
            recommendations.push("Unusual transaction pattern detected. Please review details.");
        }

        if (features.amount > features.avgTransactionSize * 3) {
            recommendations.push("Transaction amount significantly higher than usual.");
        }

        return recommendations;
    }

    // Helper methods
    private async analyzeLiquidityPool(poolAddress: string): Promise<LiquidityMetrics> {
        const resource = await this.aptosClient.getAccountResource(
            poolAddress,
            `${this.moduleAddress}::liquidity_pool::Pool`
        );
        
        const data = resource.data as any;
        return {
            poolDepth: Number(data.total_liquidity),
            volatility: Number(data.volatility),
            volume24h: Number(data.volume_24h),
            currentPrice: Number(data.current_price),
            priceChange24h: Number(data.price_change_24h),
            optimalRange: { min: 0, max: 0 }
        };
    }

    private async getUserTransactionHistory(address: string): Promise<any> {
        const transactions = await this.aptosClient.getAccountTransactions(
            address,
            { start: 0, limit: 50 }
        );

        const patterns = transactions.map(tx => ({
            amount: Number((tx as any).payload?.arguments?.[1] || 0),
            timestamp: (tx as any).timestamp
        }));

        return {
            totalVolume: patterns.reduce((sum, tx) => sum + tx.amount, 0),
            avgAmount: patterns.length > 0 ? 
                patterns.reduce((sum, tx) => sum + tx.amount, 0) / patterns.length : 0,
            patterns
        };
    }

    private async getRecipientRiskProfile(address: string): Promise<any> {
        try {
            const resource = await this.aptosClient.getAccountResource(
                address,
                `${this.moduleAddress}::defi_agent::UserProfile`
            );
            return {
                trustScore: Number((resource.data as any).trust_score) / 100
            };
        } catch {
            return { trustScore: 0.5 }; // Default trust score for new addresses
        }
    }

    private async logTransactionMetrics(
        fromAddress: AptosAccount,
        toAddress: string,
        amount: number,
        riskAssessment: RiskAssessment
    ): Promise<void> {
        const metrics = {
            fromAddress: fromAddress.address().toString(),
            toAddress,
            amount,
            riskScore: riskAssessment.riskScore,
            anomalyScore: riskAssessment.anomalyScore,
            recommendations: riskAssessment.recommendations,
            timestamp: new Date().toISOString()
        };
        
        // Log metrics to blockchain
        const payload = {
            function: `${this.moduleAddress}::defi_agent::log_metrics`,
            type_arguments: [],
            arguments: [Buffer.from(JSON.stringify(metrics)).toString('hex')]
        };

        try {
            const transactionHash = await this.submitTransaction(fromAddress, payload);
        } catch (error) {
            console.error("Failed to log metrics:", error);
        }
    }

    private async submitTransaction(account: AptosAccount, payload: Types.EntryFunctionPayload): Promise<string> {
        try {
            const txnRequest = await this.aptosClient.generateTransaction(account.address(), payload);
            const signedTxn = await this.aptosClient.signTransaction(account, txnRequest);
            const response = await this.aptosClient.submitTransaction(signedTxn);
            await this.aptosClient.waitForTransaction(response.hash);
            return response.hash;
        } catch (error) {
            console.error("Transaction submission failed:", error);
            throw error;
        }
    }
}
