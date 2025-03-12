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
exports.BiometricVerifier = void 0;
const aptos_1 = require("aptos");
class BiometricVerifier {
    constructor(nodeUrl) {
        this.aptosClient = new aptos_1.AptosClient(nodeUrl);
        // Initialize empty historical data
        this.historicalData = {
            keystrokePattern: [],
            mouseMovements: [],
            transactionTiming: []
        };
    }
    // Initialize user profile with first behavioral data
    initializeProfile(data) {
        this.historicalData = data;
    }
    // Capture keystroke dynamics
    captureKeystroke(event) {
        const timestamp = event.timeStamp;
        const keyCode = event.keyCode;
        this.historicalData.keystrokePattern.push(timestamp);
        // Keep only last 100 keystrokes for analysis
        if (this.historicalData.keystrokePattern.length > 100) {
            this.historicalData.keystrokePattern.shift();
        }
    }
    // Capture mouse movements
    captureMouseMovement(event) {
        const movement = {
            x: event.clientX,
            y: event.clientY,
            timestamp: Date.now()
        };
        this.historicalData.mouseMovements.push(movement);
        // Keep only last 100 movements for analysis
        if (this.historicalData.mouseMovements.length > 100) {
            this.historicalData.mouseMovements.shift();
        }
    }
    // Generate biometric hash from collected data
    generateBiometricHash(data) {
        // Convert biometric data to a standardized format
        const serializedData = JSON.stringify({
            keystrokeAvg: this.calculateAverageTimings(data.keystrokePattern),
            mousePatterns: this.analyzeMousePatterns(data.mouseMovements),
            transactionTimings: data.transactionTiming
        });
        // Convert string to Uint8Array
        return new TextEncoder().encode(serializedData);
    }
    // Analyze keystroke patterns
    calculateAverageTimings(keystrokes) {
        if (keystrokes.length < 2)
            return 0;
        let totalDelay = 0;
        for (let i = 1; i < keystrokes.length; i++) {
            totalDelay += keystrokes[i] - keystrokes[i - 1];
        }
        return totalDelay / (keystrokes.length - 1);
    }
    // Analyze mouse movement patterns
    analyzeMousePatterns(movements) {
        if (movements.length < 2)
            return 0;
        let totalVelocity = 0;
        for (let i = 1; i < movements.length; i++) {
            const dx = movements[i].x - movements[i - 1].x;
            const dy = movements[i].y - movements[i - 1].y;
            const dt = movements[i].timestamp - movements[i - 1].timestamp;
            const velocity = Math.sqrt(dx * dx + dy * dy) / dt;
            totalVelocity += velocity;
        }
        return totalVelocity / (movements.length - 1);
    }
    // Verify if current behavior matches historical pattern
    verifyBehavior(currentData) {
        return __awaiter(this, void 0, void 0, function* () {
            // If no historical data, return false
            if (this.historicalData.keystrokePattern.length === 0 &&
                this.historicalData.mouseMovements.length === 0) {
                console.warn("No historical data available for comparison");
                return false;
            }
            const currentHash = this.generateBiometricHash(currentData);
            const historicalHash = this.generateBiometricHash(this.historicalData);
            // Compare current behavior with historical pattern
            const similarity = this.calculateSimilarity(currentHash, historicalHash);
            // Update historical data if verification successful
            if (similarity >= BiometricVerifier.ANOMALY_THRESHOLD) {
                this.updateHistoricalData(currentData);
            }
            return similarity >= BiometricVerifier.ANOMALY_THRESHOLD;
        });
    }
    // Update historical data with new verified behavior
    updateHistoricalData(newData) {
        // Merge new data with historical data
        this.historicalData.keystrokePattern = [
            ...this.historicalData.keystrokePattern,
            ...newData.keystrokePattern
        ].slice(-100); // Keep last 100 samples
        this.historicalData.mouseMovements = [
            ...this.historicalData.mouseMovements,
            ...newData.mouseMovements
        ].slice(-100); // Keep last 100 samples
        this.historicalData.transactionTiming = [
            ...this.historicalData.transactionTiming,
            ...newData.transactionTiming
        ].slice(-50); // Keep last 50 samples
    }
    // Calculate similarity between two biometric hashes
    calculateSimilarity(hash1, hash2) {
        if (hash1.length !== hash2.length)
            return 0;
        let matchingBits = 0;
        for (let i = 0; i < hash1.length; i++) {
            matchingBits += (hash1[i] === hash2[i]) ? 1 : 0;
        }
        return matchingBits / hash1.length;
    }
    // Update behavioral profile on the blockchain
    updateBlockchainProfile(account, biometricHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                function: "defi_biometrics::credit_system::update_biometric_hash",
                type_arguments: [],
                arguments: [Array.from(biometricHash)]
            };
            try {
                const transaction = yield this.aptosClient.generateTransaction(account.address(), payload);
                const signedTx = yield this.aptosClient.signTransaction(account, transaction);
                const response = yield this.aptosClient.submitTransaction(signedTx);
                yield this.aptosClient.waitForTransaction(response.hash);
                console.log("Blockchain profile updated successfully");
            }
            catch (error) {
                console.error("Failed to update blockchain profile:", error);
                throw error;
            }
        });
    }
}
exports.BiometricVerifier = BiometricVerifier;
BiometricVerifier.ANOMALY_THRESHOLD = 0.85;
