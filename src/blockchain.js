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
exports.DeFiAgent = void 0;
const aptos_1 = require("aptos");
const biometrics_1 = require("./biometrics");
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
class DeFiAgent {
    constructor(nodeUrl, firebaseConfig) {
        this.aptosClient = new aptos_1.AptosClient(nodeUrl);
        this.biometricVerifier = new biometrics_1.BiometricVerifier(nodeUrl);
        // Initialize Firebase
        const app = (0, app_1.initializeApp)(firebaseConfig);
        this.db = (0, firestore_1.getFirestore)(app);
    }
    // Initialize user profile on blockchain
    initializeProfile(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                function: "defi_biometrics::credit_system::initialize_profile",
                type_arguments: [],
                arguments: []
            };
            try {
                const transaction = yield this.aptosClient.generateTransaction(account.address(), payload);
                const signedTx = yield this.aptosClient.signTransaction(account, transaction);
                const response = yield this.aptosClient.submitTransaction(signedTx);
                yield this.aptosClient.waitForTransaction(response.hash);
                // Initialize empty behavioral profile in Firebase
                const userRef = (0, firestore_1.doc)(this.db, "user_behavior", account.address().hex());
                yield (0, firestore_1.setDoc)(userRef, {
                    baselineBehavior: null,
                    lastUpdated: new Date().toISOString(),
                    creditScore: 500 // Initial credit score
                });
                console.log("Profile initialized successfully");
            }
            catch (error) {
                console.error("Failed to initialize profile:", error);
                throw error;
            }
        });
    }
    // Execute secure transfer with biometric verification
    executeSecureTransfer(fromAccount, toAddress, amount, biometricData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // First check for anomalous behavior
                const isAnomalous = yield this.detectAnomalousActivity(fromAccount.address().hex(), biometricData);
                if (isAnomalous) {
                    console.error("Anomalous behavior detected");
                    return false;
                }
                // Verify biometric data
                const isVerified = yield this.biometricVerifier.verifyBehavior(biometricData);
                if (!isVerified) {
                    console.error("Biometric verification failed");
                    yield this.logSecurityEvent(fromAccount.address().hex(), "failed_biometric");
                    return false;
                }
                // Generate biometric hash
                const biometricHash = this.biometricVerifier.generateBiometricHash(biometricData);
                const payload = {
                    function: "defi_biometrics::credit_system::verify_and_transfer",
                    type_arguments: [],
                    arguments: [
                        toAddress,
                        amount,
                        Array.from(biometricHash)
                    ]
                };
                const transaction = yield this.aptosClient.generateTransaction(fromAccount.address(), payload);
                const signedTx = yield this.aptosClient.signTransaction(fromAccount, transaction);
                const response = yield this.aptosClient.submitTransaction(signedTx);
                yield this.aptosClient.waitForTransaction(response.hash);
                // Update behavioral baseline after successful transaction
                yield this.updateBehavioralBaseline(fromAccount.address().hex(), biometricData);
                // Log successful transaction
                yield this.logTransaction(fromAccount.address().hex(), toAddress, amount);
                // Update credit score
                const newScore = yield this.getCreditScore(fromAccount.address().hex());
                yield this.updateUserProfile(fromAccount.address().hex(), { creditScore: newScore });
                return true;
            }
            catch (error) {
                console.error("Transaction failed:", error);
                yield this.logSecurityEvent(fromAccount.address().hex(), "failed_transaction", (error === null || error === void 0 ? void 0 : error.message) || "Unknown error");
                return false;
            }
        });
    }
    // Get user's credit score
    getCreditScore(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resource = yield this.aptosClient.getAccountResource(address, "defi_biometrics::credit_system::UserProfile");
                const score = resource.data.credit_score;
                // Update score in Firebase
                yield this.updateUserProfile(address, { creditScore: score });
                return score;
            }
            catch (error) {
                console.error("Failed to fetch credit score:", error);
                throw error;
            }
        });
    }
    // Log security events to Firebase
    logSecurityEvent(address, eventType, details) {
        return __awaiter(this, void 0, void 0, function* () {
            const securityRef = (0, firestore_1.doc)((0, firestore_1.collection)(this.db, "security_events"));
            yield (0, firestore_1.setDoc)(securityRef, {
                address,
                eventType,
                details,
                timestamp: new Date().toISOString()
            });
        });
    }
    // Log successful transactions to Firebase
    logTransaction(fromAddress, toAddress, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const txRef = (0, firestore_1.doc)((0, firestore_1.collection)(this.db, "transactions"));
            yield (0, firestore_1.setDoc)(txRef, {
                fromAddress,
                toAddress,
                amount,
                timestamp: new Date().toISOString(),
                status: "completed"
            });
        });
    }
    // Update user profile in Firebase
    updateUserProfile(address, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRef = (0, firestore_1.doc)(this.db, "user_behavior", address);
            yield (0, firestore_1.updateDoc)(userRef, Object.assign(Object.assign({}, updates), { lastUpdated: new Date().toISOString() }));
        });
    }
    // Update behavioral baseline
    updateBehavioralBaseline(address, newBehavior) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRef = (0, firestore_1.doc)(this.db, "user_behavior", address);
            const userDoc = yield (0, firestore_1.getDoc)(userRef);
            if (!userDoc.exists()) {
                yield (0, firestore_1.setDoc)(userRef, {
                    baselineBehavior: newBehavior,
                    lastUpdated: new Date().toISOString()
                });
                return;
            }
            // Merge old and new behavior data
            const oldBehavior = userDoc.data().baselineBehavior;
            const mergedBehavior = this.mergeBehavioralData(oldBehavior, newBehavior);
            yield (0, firestore_1.updateDoc)(userRef, {
                baselineBehavior: mergedBehavior,
                lastUpdated: new Date().toISOString()
            });
        });
    }
    // Merge behavioral data
    mergeBehavioralData(oldData, newData) {
        if (!oldData)
            return newData;
        return {
            keystrokePattern: [...(oldData.keystrokePattern || []), ...newData.keystrokePattern].slice(-100),
            mouseMovements: [...(oldData.mouseMovements || []), ...newData.mouseMovements].slice(-100),
            transactionTiming: [...(oldData.transactionTiming || []), ...newData.transactionTiming].slice(-50)
        };
    }
    // Check if behavior is suspicious
    detectAnomalousActivity(address, currentBehavior) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRef = (0, firestore_1.doc)(this.db, "user_behavior", address);
            const userDoc = yield (0, firestore_1.getDoc)(userRef);
            if (!userDoc.exists()) {
                // First time user, create baseline
                yield (0, firestore_1.setDoc)(userRef, {
                    baselineBehavior: currentBehavior,
                    lastUpdated: new Date().toISOString()
                });
                return false;
            }
            const baselineBehavior = userDoc.data().baselineBehavior;
            if (!baselineBehavior)
                return false; // No baseline yet
            const similarity = yield this.biometricVerifier.verifyBehavior(currentBehavior);
            if (!similarity) {
                yield this.logSecurityEvent(address, "anomalous_behavior");
                return true;
            }
            return false;
        });
    }
}
exports.DeFiAgent = DeFiAgent;
