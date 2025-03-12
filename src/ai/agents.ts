import { AptosClient, AptosAccount, Types, HexString } from "aptos";
import { RiskAssessmentModel, AnomalyDetector, LiquidityOptimizer } from './models';
import { BiometricVerifier } from '../biometrics';

interface AgentState {
    isActive: boolean;
    lastUpdate: number;
    performanceMetrics: {
        successRate: number;
        avgResponseTime: number;
        totalTransactions: number;
    };
}

export class MoveAIAgent {
    private aptosClient: AptosClient;
    private riskModel: RiskAssessmentModel;
    private anomalyDetector: AnomalyDetector;
    private liquidityOptimizer: LiquidityOptimizer;
    private biometricVerifier: BiometricVerifier;
    private state: AgentState;
    private readonly moduleAddress: string;

    constructor(
        nodeUrl: string,
        moduleAddress: string,
        riskModel: RiskAssessmentModel,
        anomalyDetector: AnomalyDetector,
        liquidityOptimizer: LiquidityOptimizer,
        biometricVerifier: BiometricVerifier
    ) {
        this.aptosClient = new AptosClient(nodeUrl);
        this.riskModel = riskModel;
        this.anomalyDetector = anomalyDetector;
        this.liquidityOptimizer = liquidityOptimizer;
        this.biometricVerifier = biometricVerifier;
        this.moduleAddress = moduleAddress;
        this.state = {
            isActive: false,
            lastUpdate: Date.now(),
            performanceMetrics: {
                successRate: 1.0,
                avgResponseTime: 0,
                totalTransactions: 0
            }
        };
    }

    async initialize(): Promise<void> {
        await Promise.all([
            this.riskModel.initialize(),
            this.liquidityOptimizer.initialize()
        ]);
        this.state.isActive = true;
    }

    async monitorTransactions(account: AptosAccount): Promise<void> {
        if (!this.state.isActive) {
            throw new Error("Agent not initialized");
        }

        try {
            // Subscribe to pending transactions
            const pendingTxns = await this.aptosClient.getAccountTransactions(
                account.address(),
                { start: 0, limit: 100 }
            );

            for (const txn of pendingTxns) {
                await this.analyzePendingTransaction(txn as Types.Transaction_UserTransaction);
            }

            // Update performance metrics
            this.updatePerformanceMetrics();
        } catch (error) {
            console.error("Error monitoring transactions:", error);
            throw error;
        }
    }

    private async analyzePendingTransaction(
        transaction: Types.Transaction_UserTransaction
    ): Promise<void> {
        const startTime = Date.now();

        try {
            // Extract transaction data
            const payload = transaction.payload as Types.TransactionPayload_EntryFunctionPayload;
            const args = payload.arguments;

            // Analyze transaction risk
            const riskScore = await this.assessTransactionRisk(transaction);
            
            if (riskScore > 0.7) {
                await this.mitigateRisk(transaction);
            }

            // Update metrics
            this.state.performanceMetrics.totalTransactions++;
            this.state.performanceMetrics.avgResponseTime = 
                (this.state.performanceMetrics.avgResponseTime * (this.state.performanceMetrics.totalTransactions - 1) +
                (Date.now() - startTime)) / this.state.performanceMetrics.totalTransactions;
        } catch (error) {
            console.error("Error analyzing transaction:", error);
            this.state.performanceMetrics.successRate = 
                (this.state.performanceMetrics.successRate * this.state.performanceMetrics.totalTransactions) /
                (this.state.performanceMetrics.totalTransactions + 1);
        }
    }

    private async assessTransactionRisk(
        transaction: Types.Transaction_UserTransaction
    ): Promise<number> {
        // Extract relevant features
        const features = await this.extractTransactionFeatures(transaction);
        
        // Get risk assessment
        const riskScore = await this.riskModel.predict(features);
        
        return riskScore;
    }

    private async mitigateRisk(
        transaction: Types.Transaction_UserTransaction
    ): Promise<void> {
        const payload = {
            function: `${this.moduleAddress}::defi_agent::handle_risky_transaction`,
            type_arguments: [],
            arguments: [
                transaction.sender,
                transaction.sequence_number.toString()
            ]
        };

        try {
            // Call smart contract to handle risky transaction
            await this.submitTransaction(transaction.sender, payload);
        } catch (error) {
            console.error("Error mitigating risk:", error);
            throw error;
        }
    }

    private async extractTransactionFeatures(
        transaction: Types.Transaction_UserTransaction
    ): Promise<any> {
        // Extract basic transaction data
        const sender = transaction.sender;
        const amount = (transaction.payload as any).arguments[1] || 0;

        // Get historical data
        const history = await this.getTransactionHistory(sender);

        return {
            amount: Number(amount),
            historicalVolume: history.totalVolume,
            avgTransactionSize: history.avgAmount,
            recipientTrustScore: 0.8, // Default trust score
            biometricConfidence: 1.0, // Default confidence
            timeOfDay: new Date().getHours(),
            dayOfWeek: new Date().getDay()
        };
    }

    private async getTransactionHistory(address: string): Promise<any> {
        try {
            const transactions = await this.aptosClient.getAccountTransactions(
                address,
                { start: 0, limit: 50 }
            );

            const amounts = transactions
                .filter(tx => (tx as Types.Transaction_UserTransaction).success)
                .map(tx => Number((tx as any).payload.arguments[1] || 0));

            return {
                totalVolume: amounts.reduce((a, b) => a + b, 0),
                avgAmount: amounts.length > 0 ? 
                    amounts.reduce((a, b) => a + b, 0) / amounts.length : 0
            };
        } catch (error) {
            console.error("Error fetching transaction history:", error);
            return { totalVolume: 0, avgAmount: 0 };
        }
    }

    private updatePerformanceMetrics(): void {
        // Update last check timestamp
        this.state.lastUpdate = Date.now();

        // Log metrics for monitoring
        console.log("Agent Performance Metrics:", {
            successRate: this.state.performanceMetrics.successRate,
            avgResponseTime: this.state.performanceMetrics.avgResponseTime,
            totalTransactions: this.state.performanceMetrics.totalTransactions
        });
    }

    private async submitTransaction(sender: AptosAccount | string, payload: Types.EntryFunctionPayload): Promise<string> {
        try {
            const senderAccount = typeof sender === 'string' ? 
                new AptosAccount(HexString.ensure(sender).toUint8Array()) : 
                sender;
            
            const txnRequest = await this.aptosClient.generateTransaction(senderAccount.address(), payload);
            const signedTxn = await this.aptosClient.signTransaction(senderAccount, txnRequest);
            const response = await this.aptosClient.submitTransaction(signedTxn);
            await this.aptosClient.waitForTransaction(response.hash);
            return response.hash;
        } catch (error) {
            console.error("Transaction submission failed:", error);
            throw error;
        }
    }

    // Liquidity optimization methods
    async optimizeLiquidityPool(
        poolAddress: string,
        currentMetrics: any
    ): Promise<void> {
        try {
            const features = {
                poolDepth: currentMetrics.poolDepth,
                volatility: currentMetrics.volatility,
                volume24h: currentMetrics.volume24h,
                currentPrice: currentMetrics.currentPrice,
                priceChange24h: currentMetrics.priceChange24h
            };

            const optimalRange = await this.liquidityOptimizer.optimizeRange(features);

            // Execute optimization if needed
            if (currentMetrics.poolDepth < optimalRange.min || 
                currentMetrics.poolDepth > optimalRange.max) {
                await this.adjustLiquidity(poolAddress, optimalRange);
            }
        } catch (error) {
            console.error("Error optimizing liquidity:", error);
            throw error;
        }
    }

    private async adjustLiquidity(
        poolAddress: string,
        targetRange: { min: number; max: number }
    ): Promise<void> {
        const payload = {
            function: `${this.moduleAddress}::defi_agent::adjust_liquidity`,
            type_arguments: [],
            arguments: [
                poolAddress,
                targetRange.min.toString(),
                targetRange.max.toString()
            ]
        };

        try {
            // Call smart contract to adjust liquidity
            await this.submitTransaction(poolAddress, payload);
        } catch (error) {
            console.error("Error adjusting liquidity:", error);
            throw error;
        }
    }
}
