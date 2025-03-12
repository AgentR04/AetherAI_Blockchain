import { AptosClient, AptosAccount, CoinClient, Types, BCS } from 'aptos';

// Constants
const NODE_URL = process.env.REACT_APP_APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com';
const DEFI_AGENT_ADDRESS = process.env.REACT_APP_DEFI_AGENT_ADDRESS;
const MODULE_NAME = 'defi_agent';
const APTOS_COIN_TYPE = '0x1::aptos_coin::AptosCoin';

// Initialize Aptos client
const client = new AptosClient(NODE_URL);
const coinClient = new CoinClient(client);

export interface UserProfile {
  creditScore: number;
  totalTransactions: number;
  successfulVerifications: number;
  failedVerifications: number;
  lastBiometricHash: number[];
}

export interface Transaction {
  hash: string;
  amount: string;
  toAddress: string;
  timestamp: number;
  success: boolean;
  biometricConfidence?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  hash?: string;
}

export const defiAgent = {
  // Initialize user profile and coin store
  async initializeProfile(account: AptosAccount): Promise<ApiResponse<string>> {
    try {
      // First, try to initialize the coin store
      try {
        const payload: Types.TransactionPayload = {
          type: 'entry_function_payload',
          function: '0x1::managed_coin::register',
          type_arguments: [APTOS_COIN_TYPE],
          arguments: []
        };

        const rawTxn = await client.generateTransaction(account.address(), payload);
        const signedTxn = await client.signTransaction(account, rawTxn);
        const pendingTxn = await client.submitTransaction(signedTxn);
        await client.waitForTransaction(pendingTxn.hash);
      } catch (error) {
        // Ignore error if coin store already exists
        console.log('Coin store might already exist:', error);
      }

      // Then initialize the profile
      const profilePayload: Types.TransactionPayload = {
        type: 'entry_function_payload',
        function: `${DEFI_AGENT_ADDRESS}::${MODULE_NAME}::initialize_profile`,
        type_arguments: [],
        arguments: []
      };

      const rawTxn = await client.generateTransaction(account.address(), profilePayload);
      const signedTxn = await client.signTransaction(account, rawTxn);
      const pendingTxn = await client.submitTransaction(signedTxn);
      const txnHash = pendingTxn.hash;
      
      await client.waitForTransaction(txnHash);

      return {
        success: true,
        data: txnHash,
        hash: txnHash
      };
    } catch (error) {
      console.error('Error initializing profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Get user profile
  async getUserProfile(address: string): Promise<ApiResponse<UserProfile>> {
    try {
      const resource = await client.getAccountResource(
        address,
        `${DEFI_AGENT_ADDRESS}::${MODULE_NAME}::UserProfile`
      );

      const data = resource.data as any;
      const userProfile: UserProfile = {
        creditScore: Number(data.credit_score),
        totalTransactions: Number(data.total_transactions),
        successfulVerifications: Number(data.successful_verifications),
        failedVerifications: Number(data.failed_verifications),
        lastBiometricHash: data.last_biometric_hash || []
      };
      
      return {
        success: true,
        data: userProfile
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        success: false,
        error: 'Profile not found'
      };
    }
  },

  // Verify and transfer
  async verifyAndTransfer(
    account: AptosAccount,
    toAddress: string,
    amount: number,
    biometricHash: Uint8Array
  ): Promise<ApiResponse<string>> {
    try {
      const payload: Types.TransactionPayload = {
        type: 'entry_function_payload',
        function: `${DEFI_AGENT_ADDRESS}::${MODULE_NAME}::verify_and_transfer`,
        type_arguments: [],
        arguments: [toAddress, amount, Array.from(biometricHash)]
      };

      const rawTxn = await client.generateTransaction(account.address(), payload);
      const signedTxn = await client.signTransaction(account, rawTxn);
      const pendingTxn = await client.submitTransaction(signedTxn);
      const txnHash = pendingTxn.hash;
      
      await client.waitForTransaction(txnHash);

      return {
        success: true,
        data: txnHash,
        hash: txnHash
      };
    } catch (error) {
      console.error('Error in verify and transfer:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Get transaction history
  async getTransactionHistory(address: string): Promise<ApiResponse<Transaction[]>> {
    try {
      // Get account resources to find transaction history
      const resources = await client.getAccountResources(address);
      const userProfileResource = resources.find(
        (r) => r.type === `${DEFI_AGENT_ADDRESS}::${MODULE_NAME}::UserProfile`
      );

      if (!userProfileResource) {
        return {
          success: true,
          data: []
        };
      }

      // For now, we'll return mock transaction data
      // In a real implementation, you would parse the transaction history from the blockchain
      const mockTransactions: Transaction[] = [
        {
          hash: '0x1234567890abcdef',
          amount: '100',
          toAddress: '0x9876543210fedcba',
          timestamp: Date.now() - 300000, // 5 minutes ago
          success: true,
          biometricConfidence: 0.95
        },
        {
          hash: '0xabcdef1234567890',
          amount: '50',
          toAddress: '0xfedcba9876543210',
          timestamp: Date.now() - 900000, // 15 minutes ago
          success: true,
          biometricConfidence: 0.88
        }
      ];

      return {
        success: true,
        data: mockTransactions
      };
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get transaction history'
      };
    }
  },

  // Get account balance
  async getBalance(address: string): Promise<ApiResponse<string>> {
    try {
      // First check if the coin store exists
      try {
        await client.getAccountResource(
          address,
          '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
        );
      } catch (error) {
        return {
          success: true,
          data: '0',
          error: 'Coin store not initialized'
        };
      }

      // If coin store exists, get the balance
      const balance = await coinClient.checkBalance(address);
      return {
        success: true,
        data: balance.toString()
      };
    } catch (error) {
      console.error('Error fetching balance:', error);
      return {
        success: false,
        data: '0',
        error: error instanceof Error ? error.message : 'Failed to get balance'
      };
    }
  }
};
