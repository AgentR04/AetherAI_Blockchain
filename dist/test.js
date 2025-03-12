"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aptos_1 = require("aptos");
const blockchain_1 = require("./blockchain");
const models_1 = require("./ai/models");
const biometrics_1 = require("./biometrics");
// Configuration
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const MODULE_ADDRESS = "0x1"; // Example module address
// Initialize AI models
const riskModel = new models_1.RiskAssessmentModel();
const anomalyDetector = new models_1.AnomalyDetector();
const liquidityOptimizer = new models_1.LiquidityOptimizer();
const biometricVerifier = new biometrics_1.BiometricVerifier(NODE_URL);
// Initialize DeFi agent
const agent = new blockchain_1.DeFiAgent(NODE_URL, MODULE_ADDRESS, riskModel, anomalyDetector, liquidityOptimizer, biometricVerifier);
async function testTransaction() {
    try {
        // Create test accounts
        const sender = new aptos_1.AptosAccount();
        const recipient = new aptos_1.AptosAccount();
        // Test biometric data (simulated)
        const biometricData = {
            keystrokePattern: [100, 150, 200],
            mouseMovement: [[10, 20], [30, 40]],
            transactionTiming: Date.now()
        };
        // Execute transaction with AI risk assessment
        const result = await agent.executeSecureTransfer(sender, recipient.address().hex(), 1000000, // Amount in Octas
        biometricData);
        console.log("Transaction result:", result);
    }
    catch (error) {
        console.error("Test failed:", error);
    }
}
// Run tests
testTransaction();
