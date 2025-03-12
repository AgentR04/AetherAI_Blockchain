"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDataGenerator = void 0;
class TestDataGenerator {
    // Generate normal user behavior
    static generateNormalBehavior() {
        return {
            keystrokePatterns: this.generateNormalKeystrokePatterns(),
            mouseMovements: this.generateNormalMouseMovements(),
            transactionTiming: this.generateNormalTransactionTiming()
        };
    }
    // Generate anomalous behavior
    static generateAnomalousBehavior() {
        return {
            keystrokePatterns: this.generateAnomalousKeystrokePatterns(),
            mouseMovements: this.generateAnomalousMouseMovements(),
            transactionTiming: this.generateAnomalousTransactionTiming()
        };
    }
    // Normal keystroke pattern generation
    static generateNormalKeystrokePatterns() {
        const patterns = [];
        const keys = 'asdfjkl;'.split('');
        let timestamp = Date.now();
        for (let i = 0; i < 10; i++) {
            const key = keys[Math.floor(Math.random() * keys.length)];
            const pressTime = timestamp;
            const holdTime = this.NORMAL_HOLD_TIME + this.randomVariation(20);
            patterns.push({
                key,
                pressTime,
                releaseTime: pressTime + holdTime
            });
            timestamp += this.NORMAL_TYPING_SPEED + this.randomVariation(50);
        }
        return patterns;
    }
    // Anomalous keystroke pattern generation
    static generateAnomalousKeystrokePatterns() {
        const patterns = [];
        const keys = 'asdfjkl;'.split('');
        let timestamp = Date.now();
        for (let i = 0; i < 10; i++) {
            const key = keys[Math.floor(Math.random() * keys.length)];
            const pressTime = timestamp;
            // Extremely fast or slow typing
            const holdTime = Math.random() > 0.5 ?
                this.NORMAL_HOLD_TIME * 5 : // Very slow
                this.NORMAL_HOLD_TIME / 5; // Very fast
            patterns.push({
                key,
                pressTime,
                releaseTime: pressTime + holdTime
            });
            timestamp += Math.random() > 0.5 ?
                this.NORMAL_TYPING_SPEED * 4 : // Very slow
                this.NORMAL_TYPING_SPEED / 4; // Very fast
        }
        return patterns;
    }
    // Normal mouse movement generation
    static generateNormalMouseMovements() {
        const movements = [];
        let x = 500;
        let y = 500;
        let timestamp = Date.now();
        let velocity = this.NORMAL_MOUSE_SPEED;
        let acceleration = 0;
        for (let i = 0; i < 10; i++) {
            // Smooth, natural movement
            const targetX = 500 + Math.cos(i / Math.PI) * 100;
            const targetY = 500 + Math.sin(i / Math.PI) * 100;
            const dx = targetX - x;
            const dy = targetY - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            velocity += acceleration;
            velocity = Math.max(100, Math.min(1000, velocity));
            const timeIncrement = (distance / velocity) * 1000;
            timestamp += timeIncrement;
            movements.push({
                x: targetX,
                y: targetY,
                timestamp,
                velocity,
                acceleration
            });
            // Smooth acceleration changes
            acceleration = this.randomVariation(50) - 25;
            x = targetX;
            y = targetY;
        }
        return movements;
    }
    // Anomalous mouse movement generation
    static generateAnomalousMouseMovements() {
        const movements = [];
        let x = 500;
        let y = 500;
        let timestamp = Date.now();
        let velocity = this.NORMAL_MOUSE_SPEED * 3; // Much faster than normal
        let acceleration = 100; // Extreme acceleration
        for (let i = 0; i < 10; i++) {
            // Erratic movement
            const targetX = x + (Math.random() - 0.5) * 400;
            const targetY = y + (Math.random() - 0.5) * 400;
            velocity += acceleration;
            velocity = Math.max(2000, Math.min(5000, velocity)); // Very high speed
            timestamp += 50; // Very quick movements
            movements.push({
                x: targetX,
                y: targetY,
                timestamp,
                velocity,
                acceleration
            });
            // Extreme acceleration changes
            acceleration = (Math.random() - 0.5) * 400;
            x = targetX;
            y = targetY;
        }
        return movements;
    }
    // Normal transaction timing generation
    static generateNormalTransactionTiming() {
        const timings = [];
        let startTime = Date.now();
        for (let i = 0; i < 5; i++) {
            const confirmTime = startTime + this.NORMAL_TRANSACTION_TIME + this.randomVariation(500);
            const totalDuration = confirmTime - startTime + this.randomVariation(200);
            timings.push({
                startTime,
                confirmTime,
                totalDuration
            });
            startTime = confirmTime + 5000 + this.randomVariation(1000); // 5 seconds between transactions
        }
        return timings;
    }
    // Anomalous transaction timing generation
    static generateAnomalousTransactionTiming() {
        const timings = [];
        let startTime = Date.now();
        for (let i = 0; i < 5; i++) {
            if (Math.random() > 0.5) {
                // Extremely fast transactions
                const confirmTime = startTime + 100; // Suspiciously quick
                const totalDuration = confirmTime - startTime;
                timings.push({
                    startTime,
                    confirmTime,
                    totalDuration
                });
                startTime = confirmTime + 100; // Very little time between transactions
            }
            else {
                // Extremely slow transactions
                const confirmTime = startTime + (this.NORMAL_TRANSACTION_TIME * 5);
                const totalDuration = confirmTime - startTime + 10000;
                timings.push({
                    startTime,
                    confirmTime,
                    totalDuration
                });
                startTime = confirmTime + 30000; // Long gaps between transactions
            }
        }
        return timings;
    }
    // Helper function for random variations
    static randomVariation(range) {
        return (Math.random() - 0.5) * range;
    }
}
exports.TestDataGenerator = TestDataGenerator;
TestDataGenerator.NORMAL_TYPING_SPEED = 200; // ms between keystrokes
TestDataGenerator.NORMAL_HOLD_TIME = 100; // ms key hold time
TestDataGenerator.NORMAL_MOUSE_SPEED = 500; // pixels per second
TestDataGenerator.NORMAL_TRANSACTION_TIME = 2000; // ms for transaction
