"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveAIAgent = void 0;
const aptos_1 = require("aptos");
class MoveAIAgent {
    constructor(nodeUrl, moduleAddress, riskModel, anomalyDetector, liquidityOptimizer, biometricVerifier) {
        this.aptosClient = new aptos_1.AptosClient(nodeUrl);
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
    async initialize() {
        await Promise.all([
            this.riskModel.initialize(),
            this.liquidityOptimizer.initialize()
        ]);
        this.state.isActive = true;
    }
    async monitorTransactions(account) {
        if (!this.state.isActive) {
            throw new Error("Agent not initialized");
        }
        try {
            // Subscribe to pending transactions
            const pendingTxns = await this.aptosClient.getAccountTransactions(account.address(), { start: 0, limit: 100 });
            for (const txn of pendingTxns) {
                await this.analyzePendingTransaction(txn);
            }
            // Update performance metrics
            this.updatePerformanceMetrics();
        }
        catch (error) {
            console.error("Error monitoring transactions:", error);
            throw error;
        }
    }
    async analyzePendingTransaction(transaction) {
        const startTime = Date.now();
        try {
            // Extract transaction data
            const payload = transaction.payload;
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
        }
        catch (error) {
            console.error("Error analyzing transaction:", error);
            this.state.performanceMetrics.successRate =
                (this.state.performanceMetrics.successRate * this.state.performanceMetrics.totalTransactions) /
                    (this.state.performanceMetrics.totalTransactions + 1);
        }
    }
    async assessTransactionRisk(transaction) {
        // Extract relevant features
        const features = await this.extractTransactionFeatures(transaction);
        // Get risk assessment
        const riskScore = await this.riskModel.predict(features);
        return riskScore;
    }
    async mitigateRisk(transaction) {
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
        }
        catch (error) {
            console.error("Error mitigating risk:", error);
            throw error;
        }
    }
    async extractTransactionFeatures(transaction) {
        // Extract basic transaction data
        const sender = transaction.sender;
        const amount = transaction.payload.arguments[1] || 0;
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
    async getTransactionHistory(address) {
        try {
            const transactions = await this.aptosClient.getAccountTransactions(address, { start: 0, limit: 50 });
            const amounts = transactions
                .filter(tx => tx.success)
                .map(tx => Number(tx.payload.arguments[1] || 0));
            return {
                totalVolume: amounts.reduce((a, b) => a + b, 0),
                avgAmount: amounts.length > 0 ?
                    amounts.reduce((a, b) => a + b, 0) / amounts.length : 0
            };
        }
        catch (error) {
            console.error("Error fetching transaction history:", error);
            return { totalVolume: 0, avgAmount: 0 };
        }
    }
    updatePerformanceMetrics() {
        // Update last check timestamp
        this.state.lastUpdate = Date.now();
        // Log metrics for monitoring
        console.log("Agent Performance Metrics:", {
            successRate: this.state.performanceMetrics.successRate,
            avgResponseTime: this.state.performanceMetrics.avgResponseTime,
            totalTransactions: this.state.performanceMetrics.totalTransactions
        });
    }
    async submitTransaction(sender, payload) {
        try {
            const senderAccount = typeof sender === 'string' ?
                new aptos_1.AptosAccount(aptos_1.HexString.ensure(sender).toUint8Array()) :
                sender;
            const txnRequest = await this.aptosClient.generateTransaction(senderAccount.address(), payload);
            const signedTxn = await this.aptosClient.signTransaction(senderAccount, txnRequest);
            const response = await this.aptosClient.submitTransaction(signedTxn);
            await this.aptosClient.waitForTransaction(response.hash);
            return response.hash;
        }
        catch (error) {
            console.error("Transaction submission failed:", error);
            throw error;
        }
    }
    // Liquidity optimization methods
    async optimizeLiquidityPool(poolAddress, currentMetrics) {
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
        }
        catch (error) {
            console.error("Error optimizing liquidity:", error);
            throw error;
        }
    }
    async adjustLiquidity(poolAddress, targetRange) {
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
        }
        catch (error) {
            console.error("Error adjusting liquidity:", error);
            throw error;
        }
    }
}
exports.MoveAIAgent = MoveAIAgent;
