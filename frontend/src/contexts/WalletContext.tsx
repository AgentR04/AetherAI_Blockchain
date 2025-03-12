import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AptosClient, AptosAccount } from 'aptos';
import { defiAgent } from '../utils/defiAgent';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface UserProfile {
  creditScore: number;
  totalTransactions: number;
  successfulVerifications: number;
  failedVerifications: number;
  lastBiometricHash: number[];
}

interface WalletContextType {
  account: AptosAccount | null;
  userProfile: UserProfile | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  balance: string;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  userProfile: null,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  balance: '0',
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<AptosAccount | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState('0');

  const connect = async () => {
    try {
      setIsConnecting(true);

      // Check if Petra wallet is installed
      const petra = (window as any).petra;
      if (!petra) {
        throw new Error('Petra wallet not found! Please install Petra wallet extension.');
      }

      // Connect to Petra wallet
      await petra.connect();
      const account = await petra.account();
      
      // Validate and convert hex public key to Uint8Array
      if (!account.publicKey || typeof account.publicKey !== 'string') {
        throw new Error('Invalid public key: Public key is missing or has invalid format');
      }

      const publicKeyHex = account.publicKey.replace('0x', '');
      if (!/^[0-9a-fA-F]+$/.test(publicKeyHex)) {
        throw new Error('Invalid public key: Contains non-hexadecimal characters');
      }

      const publicKeyBytes = new Uint8Array(
        publicKeyHex.match(/.{1,2}/g)?.map((byte: string) => parseInt(byte, 16)) || []
      );
      
      if (publicKeyBytes.length === 0) {
        throw new Error('Invalid public key: Empty byte array');
      }

      if (publicKeyBytes.length !== 32) {
        throw new Error(`Invalid public key length: Expected 32 bytes, got ${publicKeyBytes.length} bytes`);
      }
      
      // Initialize Aptos account
      let newAccount: AptosAccount;
      try {
        newAccount = new AptosAccount(publicKeyBytes);
        setAccount(newAccount);
      } catch (error) {
        throw new Error(`Failed to create Aptos account: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Get user profile
      try {
        const profile = await defiAgent.getUserProfile(account.address) as ApiResponse<UserProfile>;
        if (profile.success && profile.data) {
          setUserProfile(profile.data);
        } else {
          // Initialize profile if it doesn't exist
          await defiAgent.initializeProfile(newAccount);
          const newProfile = await defiAgent.getUserProfile(account.address) as ApiResponse<UserProfile>;
          if (newProfile.success && newProfile.data) {
            setUserProfile(newProfile.data);
          }
        }
      } catch (error) {
        console.error('Error getting user profile:', error);
        throw new Error(`Failed to initialize user profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Get account balance
      try {
        const balanceResult = await defiAgent.getBalance(account.address) as ApiResponse<string>;
        if (balanceResult.success) {
          setBalance(balanceResult.data || '0');
          if (balanceResult.error === 'Coin store not initialized') {
            // The coin store will be initialized when creating the profile
            console.log('Coin store will be initialized with profile');
          }
        } else {
          throw new Error(balanceResult.error || 'Failed to fetch balance');
        }
      } catch (error) {
        console.error('Error getting balance:', error);
        setBalance('0');
      }

    } catch (error) {
      console.error('Error connecting wallet:', error);
      setAccount(null);
      setUserProfile(null);
      setBalance('0');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setUserProfile(null);
    setBalance('0');
    // Disconnect from Petra wallet
    const petra = (window as any).petra;
    if (petra) {
      petra.disconnect();
    }
  };

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      const petra = (window as any).petra;
      if (petra && petra.isConnected) {
        try {
          await connect();
        } catch (error) {
          console.error('Auto-connect failed:', error);
        }
      }
    };
    autoConnect();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        userProfile,
        isConnecting,
        connect,
        disconnect,
        balance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
