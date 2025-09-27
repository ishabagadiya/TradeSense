// Utility functions for wallet network management

export interface WalletNetwork {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export const OG_MAINNET_NETWORK: WalletNetwork = {
  chainId: '0x67D', // 1661 in hex
  chainName: '0G Mainnet',
  nativeCurrency: {
    name: '0G',
    symbol: '0G',
    decimals: 18,
  },
  rpcUrls: ['https://evmrpc.0g.ai'],
  blockExplorerUrls: ['https://chainscan.0g.ai'],
};

export const OG_TESTNET_NETWORK: WalletNetwork = {
  chainId: '0x40EA', // 16602 in hex
  chainName: '0G Newton Testnet',
  nativeCurrency: {
    name: '0G',
    symbol: '0G',
    decimals: 18,
  },
  rpcUrls: ['https://evmrpc-testnet.0g.ai'],
  blockExplorerUrls: ['https://chainscan-galileo.0g.ai'],
};

// Function to add 0G networks to wallet
export async function addOGNetworkToWallet(network: 'mainnet' | 'testnet'): Promise<boolean> {
  if (typeof window === 'undefined' || !window.ethereum) {
    console.error('MetaMask not detected');
    return false;
  }

  const networkConfig = network === 'mainnet' ? OG_MAINNET_NETWORK : OG_TESTNET_NETWORK;

  try {
    // First try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networkConfig.chainId }],
    });
    return true;
  } catch (switchError: any) {
    // If the network doesn't exist, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add network:', addError);
        return false;
      }
    }
    console.error('Failed to switch network:', switchError);
    return false;
  }
}

// Function to detect current network and provide helpful information
export function get0GNetworkInfo(chainId: number): {
  is0GNetwork: boolean;
  networkName: string;
  addToWalletFunction?: () => Promise<boolean>;
  switchInstructions?: string;
} {
  if (chainId === 1661) {
    return {
      is0GNetwork: true,
      networkName: '0G Mainnet',
      addToWalletFunction: () => addOGNetworkToWallet('mainnet'),
      switchInstructions: 'You are on 0G Mainnet. This network supports demo swaps only.'
    };
  }
  
  if (chainId === 16602) {
    return {
      is0GNetwork: true,
      networkName: '0G Newton Testnet',
      addToWalletFunction: () => addOGNetworkToWallet('testnet'),
      switchInstructions: 'You are on 0G Newton Testnet. This network supports demo swaps only.'
    };
  }
  
  return {
    is0GNetwork: false,
    networkName: 'Unknown Network',
    switchInstructions: 'Switch to Ethereum, Optimism, Arbitrum, or Base for real 1inch swaps.'
  };
}

// Helper to format chain ID for wallet operations
export function formatChainIdForWallet(chainId: number): string {
  return '0x' + chainId.toString(16).toUpperCase();
}

// Check if user is on any 0G network
export function isOn0GNetwork(chainId: number): boolean {
  return chainId === 1661 || chainId === 16602;
}
