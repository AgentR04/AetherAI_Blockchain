import { AptosClient, AptosAccount } from "aptos";
import { DeFiAgent } from "./blockchain";
import { RiskAssessmentModel, AnomalyDetector, LiquidityOptimizer } from "./ai/models";
import { BiometricVerifier } from "./biometrics";

// Configuration
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const MODULE_ADDRESS = "0x1"; // Example module address

// Initialize AI models
const riskModel = new RiskAssessmentModel();
const anomalyDetector = new AnomalyDetector();
const liquidityOptimizer = new LiquidityOptimizer();
const biometricVerifier = new BiometricVerifier(NODE_URL);

// Initialize DeFi agent
const agent = new DeFiAgent(
    NODE_URL,
    MODULE_ADDRESS,
    riskModel,
    anomalyDetector,
    liquidityOptimizer,
    biometricVerifier
);

async function testTransaction() {
    try {
        // Create test accounts
        const sender = new AptosAccount();
        const recipient = new AptosAccount();

        // Test biometric data (simulated)
        const biometricData = {
            keystrokePattern: [100, 150, 200],
            mouseMovement: [[10, 20], [30, 40]],
            transactionTiming: Date.now()
        };

        // Execute transaction with AI risk assessment
        const result = await agent.executeSecureTransfer(
            sender,
            recipient.address().hex(),
            1000000, // Amount in Octas
            biometricData
        );

        console.log("Transaction result:", result);
    } catch (error) {
        console.error("Test failed:", error);
    }
}

// Run tests
testTransaction();
