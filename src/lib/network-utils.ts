// Network utility functions for swap integration

export interface NetworkInfo {
  chainId: number;
  name: string;
  supports1inch: boolean;
  currency: string;
  explorerUrl?: string;
  targetChain?: number; // Chain to switch to for swaps
}

// Networks supported by 1inch
export const ONEINCH_SUPPORTED_CHAINS = [1, 10, 42161, 8453, 137, 56];

export const NETWORK_INFO: Record<number, NetworkInfo> = {
  1: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    supports1inch: true,
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io'
  },
  10: {
    chainId: 10,
    name: 'Optimism',
    supports1inch: true,
    currency: 'ETH',
    explorerUrl: 'https://optimistic.etherscan.io'
  },
  42161: {
    chainId: 42161,
    name: 'Arbitrum One',
    supports1inch: true,
    currency: 'ETH',
    explorerUrl: 'https://arbiscan.io'
  },
  8453: {
    chainId: 8453,
    name: 'Base',
    supports1inch: true,
    currency: 'ETH',
    explorerUrl: 'https://basescan.org'
  },
  137: {
    chainId: 137,
    name: 'Polygon',
    supports1inch: true,
    currency: 'MATIC',
    explorerUrl: 'https://polygonscan.com'
  },
  56: {
    chainId: 56,
    name: 'BNB Smart Chain',
    supports1inch: true,
    currency: 'BNB',
    explorerUrl: 'https://bscscan.com'
  },
  1661: {
    chainId: 1661,
    name: '0G Mainnet',
    supports1inch: false,
    currency: '0G',
    explorerUrl: 'https://chainscan.0g.ai',
    targetChain: 10 // Optimism for swaps
  },
  16602: {
    chainId: 16602,
    name: '0G Newton Testnet',
    supports1inch: false,
    currency: '0G',
    explorerUrl: 'https://chainscan-galileo.0g.ai',
    targetChain: 10 // Optimism for swaps
  }
};

export function getNetworkInfo(chainId: number): NetworkInfo {
  return NETWORK_INFO[chainId] || {
    chainId,
    name: `Unknown Network (${chainId})`,
    supports1inch: false,
    currency: 'ETH'
  };
}

export function is1inchSupported(chainId: number): boolean {
  return ONEINCH_SUPPORTED_CHAINS.includes(chainId);
}

export function getSwapMode(chainId: number): 'live' | 'demo' {
  return is1inchSupported(chainId) ? 'live' : 'demo';
}

export function getSupportedNetworksText(): string {
  const supportedNetworks = ONEINCH_SUPPORTED_CHAINS
    .map(id => NETWORK_INFO[id]?.name || `Chain ${id}`)
    .filter(Boolean)
    .join(', ');
  
  return supportedNetworks;
}

// Get user-friendly network status message
export function getNetworkStatusMessage(chainId: number): {
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
} {
  const networkInfo = getNetworkInfo(chainId);
  
  if (networkInfo.supports1inch) {
    return {
      type: 'success',
      title: 'Real 1inch Swap Available',
      message: `You're on ${networkInfo.name}. Real swaps with live pricing available.`
    };
  }
  
  if (chainId === 1661) {
    return {
      type: 'info',
      title: 'Switch to Optimism for Swaps',
      message: 'You\'re on 0G Mainnet. Swaps will switch to Optimism and execute on Optimism network.'
    };
  }
  
  if (chainId === 16602) {
    return {
      type: 'info',
      title: 'Switch to Optimism for Swaps',
      message: 'You\'re on 0G Newton Testnet. Swaps will switch to Optimism and execute on Optimism network.'
    };
  }
  
  return {
    type: 'warning',
    title: 'Demo Mode',
    message: `1inch not supported on ${networkInfo.name}. Switch to a supported network for real swaps: ${getSupportedNetworksText()}`
  };
}
