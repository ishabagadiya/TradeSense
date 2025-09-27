// Simplified 1inch API integration focused on quotes
// API Documentation: https://portal.1inch.dev/documentation/apis/swap/intent-swap/swagger/quoter

export interface QuoteRequest {
  fromTokenAddress: string;  // Source token address
  toTokenAddress: string;    // Destination token address
  amount: string;           // Amount in smallest token units (wei for ETH)
  walletAddress: string;    // Wallet address
  enableEstimate?: string;  // Enable estimate (default "false")
  fee?: string;            // Fee in basis points (e.g., "0" for no fee)
  showDestAmountMinusFee?: string; // Show destination amount minus fee
  isPermit2?: string;      // Permit2 flag
  surplus?: string;        // Surplus flag (e.g., "true")
  permit?: string;         // Permit data
}

export interface QuoteResponse {
  dstAmount: string;       // Destination amount in smallest units
  srcToken: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logoURI?: string;
  };
  dstToken: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logoURI?: string;
  };
  protocols: Array<Array<{
    name: string;
    part: number;
    fromTokenAddress: string;
    toTokenAddress: string;
  }>>;
  gas: string;             // Estimated gas units
}

export interface QuoteError {
  error: string;
  description: string;
  statusCode: number;
  requestId: string;
}

const EXTERNAL_PROXY_URL = 'https://1inch-proxy-alpha.vercel.app'; // Your external proxy

class OneInchQuoteAPI {
  private chainId: number;

  constructor(chainId: number = 1, apiKey?: string) {
    this.chainId = chainId;
    // API key is handled by your external proxy
  }

  // Get quote for token swap via your external proxy (1inch Fusion API v2.0)
  async getQuote(params: QuoteRequest): Promise<QuoteResponse> {
    // Build the 1inch Fusion API path that your proxy will handle
    const apiPath = `/fusion/quoter/v2.0/${this.chainId}/quote/receive`;
    const url = new URL(apiPath, EXTERNAL_PROXY_URL);
    
    // Add required parameters
    url.searchParams.append('fromTokenAddress', params.fromTokenAddress);
    url.searchParams.append('toTokenAddress', params.toTokenAddress);
    url.searchParams.append('amount', params.amount);
    url.searchParams.append('walletAddress', params.walletAddress);
    
    // Add optional parameters with defaults
    url.searchParams.append('enableEstimate', params.enableEstimate || 'false');
    url.searchParams.append('fee', params.fee || '0');
    url.searchParams.append('showDestAmountMinusFee', params.showDestAmountMinusFee || '100000');
    url.searchParams.append('surplus', params.surplus || 'true');
    
    // Only add hex parameters if they have meaningful values
    if (params.isPermit2 && params.isPermit2 !== '' && params.isPermit2 !== '0x') {
      url.searchParams.append('isPermit2', params.isPermit2);
    }
    if (params.permit && params.permit !== '' && params.permit !== '0x') {
      url.searchParams.append('permit', params.permit);
    }

    console.log('Making direct external proxy request to 1inch Fusion API:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('✅ External proxy response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      let fullErrorData;
      try {
        fullErrorData = await response.json();
        errorMessage = fullErrorData.error || fullErrorData.message || errorMessage;
        console.error('❌ External Proxy Error Details:', {
          status: response.status,
          statusText: response.statusText,
          url: url.toString(),
          errorData: fullErrorData
        });
      } catch {
        const textError = await response.text();
        errorMessage = textError || errorMessage;
        console.error('❌ External Proxy Error Details:', {
          status: response.status,
          statusText: response.statusText,
          url: url.toString(),
          errorText: textError
        });
      }
      throw new Error(`External Proxy Error: ${errorMessage}`);
    }

    const data = await response.json();
    return data as QuoteResponse;
  }

  // Health check via your external proxy (1inch Fusion API)
  async healthCheck(): Promise<{ status: string }> {
    const url = new URL(`/fusion/quoter/v2.0/${this.chainId}/healthcheck`, EXTERNAL_PROXY_URL);
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = await response.text() || errorMessage;
      }
      throw new Error(`External Proxy Health Check Failed: ${errorMessage}`);
    }

    return await response.json();
  }
}

export default OneInchQuoteAPI;

// Utility functions for token amount conversion
export function formatTokenAmount(amount: string, decimals: number): string {
  const value = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const quotient = value / divisor;
  const remainder = value % divisor;
  
  if (remainder === BigInt(0)) {
    return quotient.toString();
  }
  
  const remainderStr = remainder.toString().padStart(decimals, '0');
  const trimmedRemainder = remainderStr.replace(/0+$/, '');
  
  if (trimmedRemainder === '') {
    return quotient.toString();
  }
  
  return `${quotient}.${trimmedRemainder}`;
}

export function parseTokenAmount(amount: string, decimals: number): string {
  const [wholePart, fractionalPart = ''] = amount.split('.');
  const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals);
  return (BigInt(wholePart) * BigInt(10 ** decimals) + BigInt(paddedFractional)).toString();
}

// Common token addresses for popular chains
export const COMMON_TOKENS = {
  1: { // Ethereum Mainnet
    ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    USDC: '0xA0b86a33E6441c4E79bb18a35651bfBe11B3f2B0',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  10: { // Optimism
    ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    USDC: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    USDT: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    WETH: '0x4200000000000000000000000000000000000006',
    OP: '0x4200000000000000000000000000000000000042',
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  },
  42161: { // Arbitrum One
    ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    ARB: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  },
};

// Token metadata for common tokens
export const TOKEN_METADATA: Record<string, { symbol: string; decimals: number; name: string }> = {
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE': { symbol: 'ETH', decimals: 18, name: 'Ethereum' },
  '0xA0b86a33E6441c4E79bb18a35651bfBe11B3f2B0': { symbol: 'USDC', decimals: 6, name: 'USD Coin' },
  '0xdAC17F958D2ee523a2206206994597C13D831ec7': { symbol: 'USDT', decimals: 6, name: 'Tether' },
  '0x6B175474E89094C44Da98b954EedeAC495271d0F': { symbol: 'DAI', decimals: 18, name: 'Dai Stablecoin' },
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': { symbol: 'WETH', decimals: 18, name: 'Wrapped Ether' },
  '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85': { symbol: 'USDC', decimals: 6, name: 'USD Coin (Optimism)' },
  '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58': { symbol: 'USDT', decimals: 6, name: 'Tether (Optimism)' },
  '0x4200000000000000000000000000000000000006': { symbol: 'WETH', decimals: 18, name: 'Wrapped Ether (Optimism)' },
  '0x4200000000000000000000000000000000000042': { symbol: 'OP', decimals: 18, name: 'Optimism' },
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': { symbol: 'USDC', decimals: 6, name: 'USD Coin (Arbitrum)' },
  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9': { symbol: 'USDT', decimals: 6, name: 'Tether (Arbitrum)' },
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': { symbol: 'WETH', decimals: 18, name: 'Wrapped Ether (Arbitrum)' },
  '0x912CE59144191C1204E64559FE8253a0e49E6548': { symbol: 'ARB', decimals: 18, name: 'Arbitrum' },
};

// Example usage functions
export async function getQuoteExample() {
  const api = new OneInchQuoteAPI(1); // Ethereum mainnet
  
  try {
    const quote = await api.getQuote({
      fromTokenAddress: COMMON_TOKENS[1].WETH,  // WETH
      toTokenAddress: COMMON_TOKENS[1].DAI,     // DAI
      amount: '100000',                         // Example amount
      walletAddress: '0x0000000000000000000000000000000000000000',
      enableEstimate: 'false',
      fee: '0',
      showDestAmountMinusFee: '100000',
      isPermit2: '',
      surplus: 'true',
      permit: ''
    });
    
    console.log('Quote received:', {
      inputAmount: formatTokenAmount('1000000', 6),
      inputToken: quote.srcToken.symbol,
      outputAmount: formatTokenAmount(quote.dstAmount, quote.dstToken.decimals),
      outputToken: quote.dstToken.symbol,
      estimatedGas: quote.gas,
    });
    
    return quote;
  } catch (error) {
    console.error('Failed to get quote:', error);
    throw error;
  }
}

// Helper function to get token decimals
export function getTokenDecimals(tokenAddress: string): number {
  const metadata = TOKEN_METADATA[tokenAddress.toLowerCase()];
  return metadata ? metadata.decimals : 18; // Default to 18 decimals
}
