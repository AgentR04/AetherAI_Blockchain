module defi_agent::defi_agent {
    use std::signer;
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_INVALID_BIOMETRIC: u64 = 3;
    const E_INSUFFICIENT_BALANCE: u64 = 4;

    // Constants
    const INITIAL_CREDIT_SCORE: u64 = 500;
    const MIN_CREDIT_SCORE: u64 = 0;
    const MAX_CREDIT_SCORE: u64 = 1000;
    const BIOMETRIC_THRESHOLD: u64 = 80;

    // User profile struct
    struct UserProfile has key {
        credit_score: u64,
        total_transactions: u64,
        successful_verifications: u64,
        failed_verifications: u64,
        last_biometric_hash: vector<u8>
    }

    // Initialize a new user profile
    public entry fun initialize_profile(account: &signer) {
        let addr = signer::address_of(account);
        assert!(!exists<UserProfile>(addr), E_ALREADY_INITIALIZED);

        move_to(account, UserProfile {
            credit_score: INITIAL_CREDIT_SCORE,
            total_transactions: 0,
            successful_verifications: 0,
            failed_verifications: 0,
            last_biometric_hash: vector::empty()
        });
    }

    // Verify biometric data and execute transfer
    public entry fun verify_and_transfer(
        from_account: &signer,
        to_address: address,
        amount: u64,
        biometric_hash: vector<u8>
    ) acquires UserProfile {
        let from_addr = signer::address_of(from_account);
        
        // Verify user profile exists
        assert!(exists<UserProfile>(from_addr), E_NOT_INITIALIZED);
        
        // Get user profile
        let profile = borrow_global_mut<UserProfile>(from_addr);
        
        // Verify biometric data
        let is_verified = verify_biometric_hash(&biometric_hash, &profile.last_biometric_hash);
        
        // Update verification stats
        if (is_verified) {
            profile.successful_verifications = profile.successful_verifications + 1;
        } else {
            profile.failed_verifications = profile.failed_verifications + 1;
            abort E_INVALID_BIOMETRIC
        };
        
        // Update biometric hash
        profile.last_biometric_hash = biometric_hash;
        
        // Execute transfer
        coin::transfer<AptosCoin>(from_account, to_address, amount);
        
        // Update transaction count and credit score
        profile.total_transactions = profile.total_transactions + 1;
        update_credit_score(profile);
    }

    // Internal function to verify biometric hash
    fun verify_biometric_hash(new_hash: &vector<u8>, stored_hash: &vector<u8>): bool {
        if (vector::is_empty(stored_hash)) {
            return true // First transaction always passes
        };
        
        let similarity = calculate_hash_similarity(new_hash, stored_hash);
        similarity >= BIOMETRIC_THRESHOLD
    }

    // Calculate similarity between two hashes (0-100)
    fun calculate_hash_similarity(hash1: &vector<u8>, hash2: &vector<u8>): u64 {
        let len1 = vector::length(hash1);
        let len2 = vector::length(hash2);
        
        if (len1 == 0 || len2 == 0 || len1 != len2) {
            return 0
        };
        
        let matching_bits = 0u64;
        let i = 0;
        
        while (i < len1) {
            let byte1 = *vector::borrow(hash1, i);
            let byte2 = *vector::borrow(hash2, i);
            let xor_result = byte1 ^ byte2;
            
            let j = 0;
            while (j < 8) {
                if (((xor_result >> j) & 1) == 0) {
                    matching_bits = matching_bits + 1;
                };
                j = j + 1;
            };
            
            i = i + 1;
        };
        
        (matching_bits * 100) / (len1 * 8)
    }

    // Update credit score based on verification history
    fun update_credit_score(profile: &mut UserProfile) {
        let total = profile.successful_verifications + profile.failed_verifications;
        if (total == 0) {
            return
        };
        
        let success_rate = (profile.successful_verifications * 100) / total;
        let new_score = if (success_rate >= 95) {
            profile.credit_score + 5
        } else if (success_rate >= 90) {
            profile.credit_score + 2
        } else if (success_rate < 70) {
            if (profile.credit_score >= 10) {
                profile.credit_score - 10
            } else {
                0
            }
        } else {
            profile.credit_score
        };
        
        // Ensure score stays within bounds
        if (new_score > MAX_CREDIT_SCORE) {
            profile.credit_score = MAX_CREDIT_SCORE;
        } else {
            profile.credit_score = new_score;
        };
    }
}
