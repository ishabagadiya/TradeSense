// Enhanced token registry for better symbol to address mapping
// This helps map trading signal symbols to actual token addresses

import { COMMON_TOKENS } from './1inch-api';

interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI?: string;
}

// Extended token registry with more comprehensive mappings
export const TOKEN_REGISTRY: Record<number, Record<string, TokenInfo>> = {
  1: { // Ethereum Mainnet
    'ETH': {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      symbol: 'ETH',
      decimals: 18,
      name: 'Ethereum'
    },
    'WETH': {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      symbol: 'WETH',
      decimals: 18,
      name: 'Wrapped Ether'
    },
    'USDC': {
      address: '0xA0b86a33E6441c4E79bb18a35651bfBe11B3f2B0',
      symbol: 'USDC',
      decimals: 6,
      name: 'USD Coin'
    },
    'USDT': {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      decimals: 6,
      name: 'Tether'
    },
    'DAI': {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      decimals: 18,
      name: 'Dai Stablecoin'
    },
    'BTC': {
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
      symbol: 'WBTC',
      decimals: 8,
      name: 'Wrapped Bitcoin'
    },
    'LINK': {
      address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      symbol: 'LINK',
      decimals: 18,
      name: 'Chainlink'
    },
    'UNI': {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      symbol: 'UNI',
      decimals: 18,
      name: 'Uniswap'
    }
  },
  10: { // Optimism
    'ETH': {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      symbol: 'ETH',
      decimals: 18,
      name: 'Ethereum'
    },
    'WETH': {
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      decimals: 18,
      name: 'Wrapped Ether'
    },
    'USDC': {
      address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      symbol: 'USDC',
      decimals: 6,
      name: 'USD Coin'
    },
    'USDT': {
      address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      symbol: 'USDT',
      decimals: 6,
      name: 'Tether'
    },
    'DAI': {
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      symbol: 'DAI',
      decimals: 18,
      name: 'Dai Stablecoin'
    },
    'OP': {
      address: '0x4200000000000000000000000000000000000042',
      symbol: 'OP',
      decimals: 18,
      name: 'Optimism'
    }
  },
  42161: { // Arbitrum One
    'ETH': {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      symbol: 'ETH',
      decimals: 18,
      name: 'Ethereum'
    },
    'WETH': {
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      symbol: 'WETH',
      decimals: 18,
      name: 'Wrapped Ether'
    },
    'USDC': {
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      symbol: 'USDC',
      decimals: 6,
      name: 'USD Coin'
    },
    'USDT': {
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      symbol: 'USDT',
      decimals: 6,
      name: 'Tether'
    },
    'DAI': {
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      symbol: 'DAI',
      decimals: 18,
      name: 'Dai Stablecoin'
    },
    'ARB': {
      address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
      symbol: 'ARB',
      decimals: 18,
      name: 'Arbitrum'
    }
  },
  8453: { // Base
    'ETH': {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      symbol: 'ETH',
      decimals: 18,
      name: 'Ethereum'
    },
    'WETH': {
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      decimals: 18,
      name: 'Wrapped Ether'
    },
    'USDC': {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      symbol: 'USDC',
      decimals: 6,
      name: 'USD Coin'
    },
    'DAI': {
      address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
      symbol: 'DAI',
      decimals: 18,
      name: 'Dai'
    }
  }
};

// Function to get token info by symbol and chain
export function getTokenInfo(symbol: string, chainId: number): TokenInfo | null {
  const chainTokens = TOKEN_REGISTRY[chainId];
  if (!chainTokens) return null;
  
  // Try exact match first
  const exactMatch = chainTokens[symbol.toUpperCase()];
  if (exactMatch) return exactMatch;
  
  // Try alternative symbol mappings
  const symbolMappings: Record<string, string> = {
    'BTC': 'WBTC',
    'BITCOIN': 'WBTC',
    'ETHEREUM': 'ETH'
  };
  
  const mappedSymbol = symbolMappings[symbol.toUpperCase()];
  if (mappedSymbol && chainTokens[mappedSymbol]) {
    return chainTokens[mappedSymbol];
  }
  
  return null;
}

// Function to get USDC address for any chain
export function getUSDCAddress(chainId: number): string {
  const usdcInfo = getTokenInfo('USDC', chainId);
  return usdcInfo?.address || COMMON_TOKENS[1]?.USDC || '0xA0b86a33E6441c4E79bb18a35651bfBe11B3f2B0';
}

// Function to get token address by symbol for any chain
export function getTokenAddress(symbol: string, chainId: number): string {
  const tokenInfo = getTokenInfo(symbol, chainId);
  if (tokenInfo) return tokenInfo.address;
  
  // Fallback to ETH if token not found
  const ethInfo = getTokenInfo('ETH', chainId);
  return ethInfo?.address || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
}

// Function to get all supported tokens for a chain
export function getSupportedTokensForChain(chainId: number): TokenInfo[] {
  const chainTokens = TOKEN_REGISTRY[chainId];
  if (!chainTokens) return [];
  
  return Object.values(chainTokens);
}

// Function to check if a token is supported
export function isTokenSupported(symbol: string, chainId: number): boolean {
  return getTokenInfo(symbol, chainId) !== null;
}

// Function for fuzzy token search
export function findTokenByPartialMatch(partialSymbol: string, chainId: number): TokenInfo[] {
  const chainTokens = TOKEN_REGISTRY[chainId];
  if (!chainTokens) return [];
  
  const partial = partialSymbol.toUpperCase();
  return Object.values(chainTokens).filter(token => 
    token.symbol.includes(partial) || 
    token.name.toUpperCase().includes(partial)
  );
}
