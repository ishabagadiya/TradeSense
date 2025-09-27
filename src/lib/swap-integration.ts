// Clean integration utilities for 1inch swap functionality
// Use these functions to integrate swap into your own components

import OneInchQuoteAPI, { 
    SwapRequest, 
    performSimpleSwap, 
    createSwapParamsFromUI,
    COMMON_TOKENS 
  } from './1inch-api';
  
  // Core swap function - use this in your components
  export async function executeSwap(
    sellTokenAddress: string,
    buyTokenAddress: string, 
    sellAmount: string,
    sellTokenDecimals: number,
    walletAddress: string,
    chainId: number,
    slippage: number = 1,
    executeTransaction: (tx: { to: string; data: string; value: string }) => Promise<string>
  ) {
    console.log('🚀 Starting swap execution...');
    
    // Create API instance
    const api = new OneInchQuoteAPI(chainId);
    
    // Create swap parameters
    const swapParams = createSwapParamsFromUI(
      { address: sellTokenAddress, decimals: sellTokenDecimals },
      { address: buyTokenAddress, decimals: 18 }, // Default to 18 for buy token
      sellAmount,
      walletAddress,
      slippage
    );
    
    // Execute the swap
    return await performSimpleSwap(api, swapParams, executeTransaction);
  }
  
  // Get supported tokens for a chain
  export function getSupportedTokens(chainId: number) {
    return COMMON_TOKENS[chainId as keyof typeof COMMON_TOKENS] || {};
  }
  
  // Simple swap interface type
  export interface SwapConfig {
    sellToken: {
      address: string;
      symbol: string;
      decimals: number;
    };
    buyToken: {
      address: string;
      symbol: string;
      decimals: number;
    };
    amount: string;
    slippage: number;
  }
  
  // Validate swap configuration
  export function validateSwapConfig(config: SwapConfig): string | null {
    if (!config.amount || parseFloat(config.amount) <= 0) {
      return 'Please enter a valid amount';
    }
    
    if (!config.sellToken.address || !config.sellToken.address.startsWith('0x')) {
      return 'Invalid sell token address';
    }
    
    if (!config.buyToken.address || !config.buyToken.address.startsWith('0x')) {
      return 'Invalid buy token address';
    }
    
    if (config.sellToken.address === config.buyToken.address) {
      return 'Cannot swap the same token';
    }
    
    return null;
  }
  
  // Get block explorer URL for different chains
  export function getExplorerUrl(chainId: number, txHash: string): string {
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io',
      10: 'https://optimistic.etherscan.io',
      42161: 'https://arbiscan.io',
      8453: 'https://basescan.org',
    };
    
    const explorer = explorers[chainId] || 'https://etherscan.io';
    return `${explorer}/tx/${txHash}`;
  }
  