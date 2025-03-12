"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aptos_1 = require("aptos");
const blockchain_1 = require("./blockchain");
// Test configuration
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
// Firebase config - Replace with your own
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-domain",
    projectId: "your-project-id",
    storageBucket: "your-bucket",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Initialize clients
            const client = new aptos_1.AptosClient(NODE_URL);
            const faucetClient = new aptos_1.FaucetClient(NODE_URL, FAUCET_URL);
            const defiAgent = new blockchain_1.DeFiAgent(NODE_URL, firebaseConfig);
            // Create test accounts
            const alice = new aptos_1.AptosAccount();
            const bob = new aptos_1.AptosAccount();
            // Fund accounts
            yield faucetClient.fundAccount(alice.address(), 100000000);
            yield faucetClient.fundAccount(bob.address(), 100000000);
            console.log("Test accounts created and funded");
            console.log("Alice address:", alice.address().hex());
            console.log("Bob address:", bob.address().hex());
            // Initialize profiles
            yield defiAgent.initializeProfile(alice);
            yield defiAgent.initializeProfile(bob);
            console.log("Profiles initialized");
            // Simulate some user behavior
            const mockBiometricData = {
                keystrokePattern: [100, 200, 300, 400],
                mouseMovements: [
                    { x: 100, y: 200, timestamp: Date.now() },
                    { x: 150, y: 250, timestamp: Date.now() + 100 }
                ],
                transactionTiming: [Date.now()]
            };
            // Try a transfer
            const transferAmount = 1000000;
            const success = yield defiAgent.executeSecureTransfer(alice, bob.address().hex(), transferAmount, mockBiometricData);
            if (success) {
                console.log(`Transfer of ${transferAmount} successful`);
                // Check credit scores
                const aliceScore = yield defiAgent.getCreditScore(alice.address().hex());
                const bobScore = yield defiAgent.getCreditScore(bob.address().hex());
                console.log("Alice's credit score:", aliceScore);
                console.log("Bob's credit score:", bobScore);
            }
            else {
                console.log("Transfer failed");
            }
            // Test anomaly detection
            const anomalousBehavior = {
                keystrokePattern: [1000, 2000, 3000], // Very different timing
                mouseMovements: [
                    { x: 500, y: 600, timestamp: Date.now() },
                    { x: 550, y: 650, timestamp: Date.now() + 1000 }
                ],
                transactionTiming: [Date.now()]
            };
            const isAnomalous = yield defiAgent.detectAnomalousActivity(alice.address().hex(), anomalousBehavior);
            console.log("Anomaly detection test:", isAnomalous ? "Detected" : "Not detected");
        }
        catch (error) {
            console.error("Test failed:", error);
        }
    });
}
main();
