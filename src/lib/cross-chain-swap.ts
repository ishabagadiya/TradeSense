// Simple chain switch utilities for 0G to Arbitrum

import { isOn0GNetwork } from './wallet-network-utils';
import { executeSwap } from './swap-integration';

export interface ChainSwitchResult {
  success: boolean;
  txHash?: string;
  approvalTxHash?: string;
  chainSwitched: boolean;
  error?: string;
}

export interface ChainSwitchParams {
  sellTokenAddress: string;
  buyTokenAddress: string;
  sellAmount: string;
  sellTokenDecimals: number;
  walletAddress: string;
  currentChainId: number;
  slippage?: number;
  executeTransaction: (tx: { to: string; data: string; value: string }) => Promise<string>;
}

// Function to switch to Optimism network
export async function switchToOptimism(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.ethereum) {
    console.error('MetaMask not detected');
    return false;
  }

  const optimismNetwork = {
    chainId: '0xA', // 10 in hex
    chainName: 'Optimism',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  };

  try {
    // Try to switch to Optimism
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: optimismNetwork.chainId }],
    });
    console.log('✅ Successfully switched to Optimism');
    return true;
  } catch (switchError: any) {
    // If the network doesn't exist, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [optimismNetwork],
        });
        console.log('✅ Successfully added and switched to Optimism');
        return true;
      } catch (addError) {
        console.error('❌ Failed to add Optimism network:', addError);
        return false;
      }
    }
    console.error('❌ Failed to switch to Optimism:', switchError);
    return false;
  }
}

// Main function: Switch to Optimism and execute swap
export async function executeOptimismSwap(params: ChainSwitchParams): Promise<ChainSwitchResult> {
  const { currentChainId, walletAddress, executeTransaction } = params;
  
  console.log('🔄 Starting swap process from chain:', currentChainId);
  
  // Check if we're on a 0G network
  if (!isOn0GNetwork(currentChainId)) {
    // If not on 0G, execute normal swap on current chain
    try {
      const result = await executeSwap(
        params.sellTokenAddress,
        params.buyTokenAddress,
        params.sellAmount,
        params.sellTokenDecimals,
        walletAddress,
        currentChainId,
        params.slippage || 1,
        executeTransaction
      );
      
      return {
        success: true,
        txHash: result.swapTxHash,
        approvalTxHash: result.approvalTxHash,
        chainSwitched: false
      };
    } catch (error: any) {
      return {
        success: false,
        chainSwitched: false,
        error: error.message || 'Swap failed'
      };
    }
  }
  
  // We're on a 0G network, switch to Optimism and execute swap
  console.log('🔄 Switching from 0G to Optimism for swap execution');
  
  try {
    // Step 1: Switch to Optimism
    const switchSuccess = await switchToOptimism();
    
    if (!switchSuccess) {
      return {
        success: false,
        chainSwitched: false,
        error: 'Failed to switch to Optimism network. Please switch manually and try again.'
      };
    }
    
    // Step 2: Wait for network switch to complete
    console.log('⏳ Waiting for network switch to complete...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Execute the swap on Optimism
    console.log('🔄 Executing swap on Optimism...');
    console.log('Swap parameters:', {
      sellToken: params.sellTokenAddress,
      buyToken: params.buyTokenAddress,
      amount: params.sellAmount,
      decimals: params.sellTokenDecimals,
      wallet: walletAddress,
      chainId: 10
    });
    
    const result = await executeSwap(
      params.sellTokenAddress,
      params.buyTokenAddress,
      params.sellAmount,
      params.sellTokenDecimals,
      walletAddress,
      10, // Optimism chain ID
      params.slippage || 1,
      executeTransaction
    );
    
    console.log('✅ Swap result:', result);
    
    return {
      success: true,
      txHash: result.swapTxHash,
      approvalTxHash: result.approvalTxHash,
      chainSwitched: true
    };
    
  } catch (error: any) {
    console.error('❌ Optimism swap failed:', error);
    return {
      success: false,
      chainSwitched: true, // We did switch chains
      error: error.message || 'Optimism swap failed'
    };
  }
}

// Helper function to get Optimism token addresses
export function getOptimismTokenAddress(tokenSymbol: string): string {
  const optimismTokens: Record<string, string> = {
    'USDC': '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // Correct Optimism USDC
    'USDT': '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    'WETH': '0x4200000000000000000000000000000000000006', // WETH on Optimism
    'ETH': '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', // Use USDT for ETH swaps (more liquid)
    'OP': '0x4200000000000000000000000000000000000042',
    'DAI': '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    'LINK': '0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6',
    'UNI': '0x6fd9d7AD17242c41f7131d257212c54A0e816691',
    'WBTC': '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
  };
  
  return optimismTokens[tokenSymbol.toUpperCase()] || optimismTokens['USDT'];
}

// Function to check if user needs to switch to Optimism
export function needsOptimismSwitch(currentChainId: number): boolean {
  return isOn0GNetwork(currentChainId);
}
