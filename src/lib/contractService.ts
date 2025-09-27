import { ethers } from 'ethers';
import TradeSenseABI from '../contracts/TradeSense.json';

// 0G Network configurations
export const OG_TESTNET_CONFIG = {
  chainId: 16602,
  name: '00G-Galileo-Testnet',
  currency: '0G',
  rpcUrl: 'https://evmrpc-testnet.0g.ai',
  blockExplorer: 'https://chainscan-galileo.0g.ai'
};

// 0G Mainnet configuration (COMMENTED OUT - USING TESTNET FOR NOW)
/*
export const OG_MAINNET_CONFIG = {
  chainId: 16661,
  name: '0G Mainnet',
  currency: 'OG',
  rpcUrl: 'https://evmrpc.0g.ai',
  blockExplorer: 'https://chainscan.0g.ai'
};
*/

// Contract configuration - Provided by backend (not user configurable)
export const TRADESENSE_CONTRACT = {
  address: '0x39e6544F0ce4fbcd26AD19D3a210F5B98f6E1CbF', // Backend provided
  abi: TradeSenseABI as any[]
};

export interface StoredSignal {
  tokenSymbol: string;
  signal: string;
  tp1: bigint;
  tp2: bigint;
  sl: bigint;
  signalTimeframe: string;
  confidence: number;
  reasoning: string;
  timestamp: bigint;
}

export class ContractService {
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;

  constructor() {
    this.initializeContract();
  }

  private async initializeContract() {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await provider.getSigner();
        
        // Check network
        const network = await provider.getNetwork();
        console.log('Connected to network:', {
          chainId: network.chainId.toString(),
          name: network.name,
          expectedChainId: OG_TESTNET_CONFIG.chainId
        });
        
        // Verify we're on the correct network - STRICT REQUIREMENT
        if (Number(network.chainId) !== OG_TESTNET_CONFIG.chainId) {
          throw new Error(`Wrong network! Please switch to 0G Newton Testnet (Chain ID: ${OG_TESTNET_CONFIG.chainId}). Current network: ${network.chainId}`);
        }
        
        // Check signer address and balance
        const signerAddress = await this.signer.getAddress();
        const balance = await provider.getBalance(signerAddress);
        console.log('Signer details:', {
          address: signerAddress,
          balance: ethers.formatEther(balance) + ' 0G'
        });
        
        if (TRADESENSE_CONTRACT.address && TRADESENSE_CONTRACT.abi.length > 0) {
          this.contract = new ethers.Contract(
            TRADESENSE_CONTRACT.address,
            TRADESENSE_CONTRACT.abi,
            this.signer
          );
          
          // Test contract connection
          try {
            const code = await provider.getCode(TRADESENSE_CONTRACT.address);
            if (code === '0x') {
              console.error('Contract not found at address:', TRADESENSE_CONTRACT.address);
            } else {
              console.log('Contract found at address:', TRADESENSE_CONTRACT.address);
            }
          } catch (codeError) {
            console.error('Failed to check contract code:', codeError);
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize contract:', error);
    }
  }

  async ensureConnection(): Promise<boolean> {
    try {
      if (!this.contract || !this.signer) {
        await this.initializeContract();
      }
      
      // Additional network check
      await this.validateNetwork();
      
      return this.contract !== null && this.signer !== null;
    } catch (error) {
      console.error('Failed to ensure connection:', error);
      return false;
    }
  }

  async validateNetwork(): Promise<void> {
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (Number(network.chainId) !== OG_TESTNET_CONFIG.chainId) {
        throw new Error(`Please switch to 0G Newton Testnet. Current network: Chain ID ${network.chainId}`);
      }
    } else {
      throw new Error('No wallet detected. Please install MetaMask or connect your wallet.');
    }
  }

  async isConnectedToCorrectNetwork(): Promise<boolean> {
    try {
      await this.validateNetwork();
      return true;
    } catch (error) {
      return false;
    }
  }

  async testContractConnection(): Promise<boolean> {
    try {
      if (!await this.ensureConnection()) {
        return false;
      }

      // Test a simple read operation
      const signerAddress = await this.signer!.getAddress();
      const userTokens = await this.contract!.getMyTokens();
      console.log('Contract test successful. User tokens:', userTokens.length);
      return true;
    } catch (error) {
      console.error('Contract connection test failed:', error);
      return false;
    }
  }

  async storeSignal(signalData: {
    tokenSymbol: string;
    signal: string;
    tp1: number;
    tp2: number;
    sl: number;
    signalTimeframe: string;
    confidence: number;
    reasoning: string;
  }): Promise<string | null> {
    try {
      if (!await this.ensureConnection()) {
        throw new Error('Contract not initialized');
      }

      // Verify network connection before proceeding
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Check if provider is properly connected
      try {
        const accounts = await provider.listAccounts();
        if (accounts.length === 0) {
          throw new Error('No accounts connected to wallet');
        }
        console.log('Connected accounts:', accounts.length);
      } catch (accountError) {
        console.error('Account check failed:', accountError);
        throw new Error('Wallet connection error. Please ensure your wallet is connected.');
      }
      
      const network = await provider.getNetwork();
      console.log('Network check before transaction:', {
        chainId: network.chainId.toString(),
        name: network.name
      });
      
      // Additional network validation
      if (Number(network.chainId) !== OG_TESTNET_CONFIG.chainId) {
        throw new Error(`Wrong network detected. Please switch to 0G Newton Testnet (Chain ID: ${OG_TESTNET_CONFIG.chainId})`);
      }

      // Test contract connection first
      const connectionTest = await this.testContractConnection();
      if (!connectionTest) {
        throw new Error('Contract connection test failed. Please check your network and contract deployment.');
      }

      // Input validation
      if (!signalData.tokenSymbol || signalData.tokenSymbol.trim().length === 0) {
        throw new Error('Token symbol is required');
      }
      
      if (!signalData.signal || !['buy', 'sell', 'hold'].includes(signalData.signal.toLowerCase())) {
        throw new Error('Signal must be buy, sell, or hold');
      }

      if (signalData.confidence < 0 || signalData.confidence > 100) {
        throw new Error('Confidence must be between 0 and 100');
      }

      // Truncate reasoning if too long (max 500 characters to prevent gas issues)
      const maxReasoningLength = 500;
      const truncatedReasoning = signalData.reasoning.length > maxReasoningLength 
        ? signalData.reasoning.substring(0, maxReasoningLength) + '...'
        : signalData.reasoning;

      // Convert prices to wei (assuming prices are in USD, multiply by 1e18 for precision)
      const tp1Wei = ethers.parseEther(signalData.tp1.toString());
      const tp2Wei = ethers.parseEther(signalData.tp2.toString());
      const slWei = ethers.parseEther(signalData.sl.toString());

      console.log('Storing signal with data:', {
        tokenSymbol: signalData.tokenSymbol,
        signal: signalData.signal,
        tp1Wei: tp1Wei.toString(),
        tp2Wei: tp2Wei.toString(),
        slWei: slWei.toString(),
        signalTimeframe: signalData.signalTimeframe,
        confidence: signalData.confidence,
        reasoningLength: truncatedReasoning.length
      });

      // Try different approaches to execute the transaction
      let tx;
      
      // First, try with automatic gas estimation
      try {
        console.log('Attempting transaction with automatic gas estimation...');
        tx = await this.contract!.storeSignal(
          signalData.tokenSymbol,
          signalData.signal,
          tp1Wei,
          tp2Wei,
          slWei,
          signalData.signalTimeframe,
          signalData.confidence,
          truncatedReasoning
        );
      } catch (autoError) {
        console.log('Auto gas failed, trying manual gas estimation...', autoError);
        
        // Second attempt: Manual gas estimation
        try {
          const gasEstimate = await this.contract!.storeSignal.estimateGas(
            signalData.tokenSymbol,
            signalData.signal,
            tp1Wei,
            tp2Wei,
            slWei,
            signalData.signalTimeframe,
            signalData.confidence,
            truncatedReasoning
          );
          console.log('Gas estimate:', gasEstimate.toString());
          
          // Add 50% buffer to gas estimate
          const gasLimit = gasEstimate + (gasEstimate * BigInt(50) / BigInt(100));
          
          tx = await this.contract!.storeSignal(
            signalData.tokenSymbol,
            signalData.signal,
            tp1Wei,
            tp2Wei,
            slWei,
            signalData.signalTimeframe,
            signalData.confidence,
            truncatedReasoning,
            {
              gasLimit: gasLimit,
              gasPrice: ethers.parseUnits('2', 'gwei')
            }
          );
        } catch (manualError) {
          console.log('Manual gas failed, trying with high gas limit...', manualError);
          
          // Third attempt: Fixed high gas limit
          try {
            tx = await this.contract!.storeSignal(
        signalData.tokenSymbol,
        signalData.signal,
        tp1Wei,
        tp2Wei,
        slWei,
        signalData.signalTimeframe,
        signalData.confidence,
              truncatedReasoning,
              {
                gasLimit: BigInt(500000), // High gas limit
                gasPrice: ethers.parseUnits('5', 'gwei')
              }
            );
          } catch (highGasError) {
            console.error('All transaction attempts failed:', highGasError);
            
            // Check if it's a network/contract issue
            const provider = new ethers.BrowserProvider(window.ethereum);
            const code = await provider.getCode(TRADESENSE_CONTRACT.address);
            if (code === '0x') {
              throw new Error('Smart contract not deployed at the specified address');
            }
            
            // Check network
            const network = await provider.getNetwork();
            if (Number(network.chainId) !== OG_TESTNET_CONFIG.chainId) {
              throw new Error(`Wrong network. Please switch to 0G Testnet (Chain ID: ${OG_TESTNET_CONFIG.chainId})`);
            }
            
            throw new Error('Transaction failed. Please check your wallet balance and network connection.');
          }
        }
      }

      console.log('Transaction submitted:', tx.hash);
      
      try {
        // Wait for transaction with timeout
        const receipt = await Promise.race([
          tx.wait(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Transaction timeout after 2 minutes')), 120000)
          )
        ]) as any;
        
        console.log('Transaction confirmed:', receipt?.hash);
        return tx.hash;
      } catch (receiptError) {
        console.warn('Transaction receipt error (but transaction was submitted):', receiptError);
        
        // Even if receipt fails, the transaction might still be valid
        // Return the hash so user knows it was submitted
        return tx.hash;
      }
    } catch (error) {
      console.error('Failed to store signal:', error);
      
      // Provide more helpful error messages
      if (error instanceof Error) {
        if (error.message.includes('execution reverted')) {
          throw new Error('Contract execution failed. This might be due to network issues or contract validation.');
        } else if (error.message.includes('insufficient funds')) {
          throw new Error('Insufficient 0G tokens for transaction fees');
        } else if (error.message.includes('nonce')) {
          throw new Error('Transaction nonce error. Please try again.');
        } else if (error.message.includes('gas')) {
          throw new Error('Gas estimation failed. The transaction is too complex or would fail.');
        }
      }
      
      throw error;
    }
  }

  async getMyTokenSignals(tokenSymbol: string): Promise<StoredSignal[]> {
    try {
      if (!await this.ensureConnection()) {
        throw new Error('Contract not initialized');
      }

      const signals = await this.contract!.getMyTokenSignals(tokenSymbol);
      return signals.map((signal: any) => ({
        tokenSymbol: signal.tokenSymbol,
        signal: signal.signal,
        tp1: signal.tp1,
        tp2: signal.tp2,
        sl: signal.sl,
        signalTimeframe: signal.signalTimeframe,
        confidence: Number(signal.confidence),
        reasoning: signal.reasoning,
        timestamp: signal.timestamp
      }));
    } catch (error) {
      console.error('Failed to get token signals:', error);
      return [];
    }
  }

  async getMyTokens(): Promise<string[]> {
    try {
      if (!await this.ensureConnection()) {
        throw new Error('Contract not initialized');
      }

      return await this.contract!.getMyTokens();
    } catch (error) {
      console.error('Failed to get user tokens:', error);
      return [];
    }
  }

  async getMyLatestSignal(tokenSymbol: string): Promise<StoredSignal | null> {
    try {
      if (!await this.ensureConnection()) {
        throw new Error('Contract not initialized');
      }

      const signal = await this.contract!.getMyLatestSignal(tokenSymbol);
      return {
        tokenSymbol: signal.tokenSymbol,
        signal: signal.signal,
        tp1: signal.tp1,
        tp2: signal.tp2,
        sl: signal.sl,
        signalTimeframe: signal.signalTimeframe,
        confidence: Number(signal.confidence),
        reasoning: signal.reasoning,
        timestamp: signal.timestamp
      };
    } catch (error) {
      console.error('Failed to get latest signal:', error);
      return null;
    }
  }

  async getMySignalCount(tokenSymbol: string): Promise<number> {
    try {
      if (!await this.ensureConnection()) {
        throw new Error('Contract not initialized');
      }

      const count = await this.contract!.getMySignalCount(tokenSymbol);
      return Number(count);
    } catch (error) {
      console.error('Failed to get signal count:', error);
      return 0;
    }
  }

  formatPriceFromWei(priceWei: bigint): number {
    return parseFloat(ethers.formatEther(priceWei));
  }

  formatTimestamp(timestamp: bigint): Date {
    return new Date(Number(timestamp) * 1000);
  }

  async checkTransactionStatus(txHash: string): Promise<any> {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // First check if transaction exists
        const tx = await provider.getTransaction(txHash);
        console.log('Transaction status:', tx);
        
        if (tx) {
          // Try to get receipt with timeout
          try {
            const receipt = await Promise.race([
              provider.getTransactionReceipt(txHash),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Receipt timeout')), 30000)
              )
            ]) as any;
            
            console.log('Transaction receipt:', receipt);
            return { 
              tx, 
              receipt, 
              status: receipt ? 'confirmed' : 'pending',
              explorerUrl: `${OG_TESTNET_CONFIG.blockExplorer}/tx/${txHash}`
            };
          } catch (receiptError) {
            console.log('Receipt not available yet:', receiptError);
            return { 
              tx, 
              receipt: null, 
              status: 'pending',
              explorerUrl: `${OG_TESTNET_CONFIG.blockExplorer}/tx/${txHash}`
            };
          }
        } else {
          return { tx: null, receipt: null, status: 'not_found' };
        }
      }
    } catch (error) {
      console.error('Error checking transaction status:', error);
      return { error };
    }
  }

  // Utility method to get network info for debugging
  async getNetworkInfo(): Promise<any> {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const accounts = await provider.listAccounts();
        const balance = accounts.length > 0 ? await provider.getBalance(accounts[0].address) : '0';
        
        return {
          chainId: network.chainId.toString(),
          name: network.name,
          accounts: accounts.length,
          balance: ethers.formatEther(balance) + ' 0G',
          expectedChainId: OG_TESTNET_CONFIG.chainId,
          isCorrectNetwork: Number(network.chainId) === OG_TESTNET_CONFIG.chainId
        };
      }
    } catch (error) {
      console.error('Error getting network info:', error);
      return { error };
    }
  }
}

export const contractService = new ContractService();
