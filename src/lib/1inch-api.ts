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
    quoteId?: string;        // Quote ID for order submission
  }
  
  export interface QuoteError {
    error: string;
    description: string;
    statusCode: number;
    requestId: string;
  }
  
  const EXTERNAL_PROXY_URL = 'https://1inch-proxy-alpha.vercel.app'; // Your external proxy
  
  // Simple swap interfaces (v6.1 API)
  export interface SwapRequest {
    src: string;           // Source token address
    dst: string;           // Destination token address  
    amount: string;        // Amount in smallest units
    from: string;          // Wallet address
    slippage: string;      // Slippage percentage (e.g., "1" for 1%)
    disableEstimate?: string; // Disable gas estimation
    allowPartialFill?: string; // Allow partial fills
  }
  
  export interface SwapResponse {
    tx: {
      to: string;          // Contract address to call
      data: string;        // Transaction data
      value: string;       // ETH value to send
      gasPrice?: string;   // Gas price
      gas?: string;        // Gas limit
    };
  }
  
  export interface AllowanceResponse {
    allowance: string;     // Current allowance amount
  }
  
  export interface ApproveResponse {
    to: string;            // Spender contract address
    data: string;          // Approval transaction data
    value: string;         // ETH value (usually "0")
    gasPrice?: string;     // Gas price
  }
  
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
  
    // Get settlement contract address (needed for EIP-712 signing)
    async getSettlementAddress(): Promise<string> {
      const url = new URL(`/fusion/orders/v2.0/${this.chainId}/settlement-address`, EXTERNAL_PROXY_URL);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        // Fallback to default contract addresses
        const defaultContracts: Record<number, string> = {
          1: '0x0000000000000000000000000000000000000000', // Ethereum
          42161: '0x0000000000000000000000000000000000000000', // Arbitrum
          10: '0x0000000000000000000000000000000000000000', // Optimism
        };
        
        console.warn('Failed to get settlement address, using default');
        return defaultContracts[this.chainId] || '0x0000000000000000000000000000000000000000';
      }
  
      const data = await response.json();
      return data.address || '0x0000000000000000000000000000000000000000';
    }
  
    // Submit order via your external proxy (1inch Fusion API v2.0)
    async submitOrder(orderBody: OrderSubmissionBody): Promise<any> {
      const url = new URL(`/fusion/relayer/v2.0/${this.chainId}/order/submit`, EXTERNAL_PROXY_URL);
      
      console.log('Submitting order via external proxy:', url.toString());
      console.log('Order body:', orderBody);
  
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderBody),
      });
  
      console.log('✅ Order submission response status:', response.status, response.statusText);
  
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        let fullErrorData;
        try {
          fullErrorData = await response.json();
          errorMessage = fullErrorData.error || fullErrorData.message || errorMessage;
          console.error('❌ Order Submission Error Details:', {
            status: response.status,
            statusText: response.statusText,
            url: url.toString(),
            errorData: fullErrorData,
            orderBody: orderBody
          });
        } catch {
          const textError = await response.text();
          errorMessage = textError || errorMessage;
          console.error('❌ Order Submission Error Details:', {
            status: response.status,
            statusText: response.statusText,
            url: url.toString(),
            errorText: textError,
            orderBody: orderBody
          });
        }
        throw new Error(`Order Submission Failed: ${errorMessage}`);
      }
  
      const data = await response.json();
      console.log('✅ Order submitted successfully:', data);
      return data;
    }
  
    // ===== SIMPLE SWAP METHODS (v6.1 API) =====
  
    // Check token allowance for simple swap
    async checkAllowance(tokenAddress: string, walletAddress: string): Promise<string> {
      const url = new URL(`/swap/v6.1/${this.chainId}/approve/allowance`, EXTERNAL_PROXY_URL);
      url.searchParams.append('tokenAddress', tokenAddress);
      url.searchParams.append('walletAddress', walletAddress);
  
      console.log('Checking allowance via proxy:', url.toString());
  
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Allowance check failed: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json() as AllowanceResponse;
      console.log('✅ Allowance check result:', data.allowance);
      return data.allowance;
    }
  
    // Get approval transaction for simple swap
    async getApprovalTransaction(tokenAddress: string, amount?: string): Promise<ApproveResponse> {
      const url = new URL(`/swap/v6.1/${this.chainId}/approve/transaction`, EXTERNAL_PROXY_URL);
      url.searchParams.append('tokenAddress', tokenAddress);
      if (amount) {
        url.searchParams.append('amount', amount);
      }
  
      console.log('Getting approval transaction via proxy:', url.toString());
  
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Approval transaction failed: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json() as ApproveResponse;
      console.log('✅ Approval transaction created:', data);
      return data;
    }
  
    // Get swap transaction for simple swap
    async getSwapTransaction(swapParams: SwapRequest): Promise<SwapResponse> {
      const url = new URL(`/swap/v6.1/${this.chainId}/swap`, EXTERNAL_PROXY_URL);
      
      // Add all swap parameters
      url.searchParams.append('src', swapParams.src);
      url.searchParams.append('dst', swapParams.dst);
      url.searchParams.append('amount', swapParams.amount);
      url.searchParams.append('from', swapParams.from);
      url.searchParams.append('slippage', swapParams.slippage);
      
      if (swapParams.disableEstimate) {
        url.searchParams.append('disableEstimate', swapParams.disableEstimate);
      }
      if (swapParams.allowPartialFill) {
        url.searchParams.append('allowPartialFill', swapParams.allowPartialFill);
      }
  
      console.log('Getting swap transaction via proxy:', url.toString());
  
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Swap transaction failed: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json() as SwapResponse;
      console.log('✅ Swap transaction created:', data);
      return data;
    }
  }
  
  // Order interfaces for order submission
  export interface FusionOrder {
    salt: string;           // Random salt for uniqueness
    makerAsset: string;     // Token being sold (source token address)
    takerAsset: string;     // Token being bought (destination token address)
    maker: string;          // User's wallet address
    receiver: string;       // Receiver address (usually same as maker)
    makingAmount: string;   // Amount of tokens being sold (in wei)
    takingAmount: string;   // Amount of tokens expected to receive (in wei)
    makerTraits: string;    // Maker traits (usually "0")
  }
  
  export interface OrderSubmissionBody {
    order: FusionOrder;
    signature: string;      // Order signature (requires wallet signing)
    extension: string;      // Extension data (usually "0x")
    quoteId: string;       // Quote ID from the quote response
  }
  
  // Utility functions for proper formatting
  export function formatSalt(): string {
    // Generate a proper 32-byte salt as hex string
    const salt = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
    return BigInt(salt).toString();
  }
  
  export function validateAndFormatOrder(order: any): FusionOrder {
    return {
      salt: BigInt(order.salt || formatSalt()).toString(),
      makerAsset: order.makerAsset.toLowerCase(),
      takerAsset: order.takerAsset.toLowerCase(), 
      maker: order.maker.toLowerCase(),
      receiver: order.receiver.toLowerCase(),
      makingAmount: BigInt(order.makingAmount).toString(),
      takingAmount: BigInt(order.takingAmount).toString(),
      makerTraits: BigInt(order.makerTraits || "0").toString()
    };
  }
  
  // Function to convert your current quote data to order format
  export function createOrderFromQuote(
    quote: QuoteResponse,
    quoteRequest: QuoteRequest,
    userAddress: string,
    quoteId?: string
  ): FusionOrder {
    // Generate a proper salt for order uniqueness
    const salt = formatSalt();
    
    const rawOrder = {
      salt: salt,
      makerAsset: quote.srcToken.address,        // From your quote: source token
      takerAsset: quote.dstToken.address,        // From your quote: destination token
      maker: userAddress,                        // From wallet connection
      receiver: userAddress,                     // Usually same as maker
      makingAmount: quoteRequest.amount,         // From your quote request: input amount
      takingAmount: quote.dstAmount,             // From your quote response: output amount
      makerTraits: "0"                          // Default value
    };
    
    // Validate and format the order properly
    return validateAndFormatOrder(rawOrder);
  }
  
  // Function to validate signature format
  export function validateSignature(signature: string): string {
    // Remove 0x prefix if present
    const cleanSig = signature.startsWith('0x') ? signature.slice(2) : signature;
    
    // Check if signature is valid length (130 hex chars = 65 bytes)
    if (cleanSig.length !== 130) {
      throw new Error(`Invalid signature length: expected 130 hex chars, got ${cleanSig.length}`);
    }
    
    // Return with 0x prefix
    return '0x' + cleanSig;
  }
  
  // Function to prepare complete order submission body
  export function prepareOrderSubmission(
    quote: QuoteResponse,
    quoteRequest: QuoteRequest,
    userAddress: string,
    signature: string,
    quoteId?: string
  ): OrderSubmissionBody {
    const order = createOrderFromQuote(quote, quoteRequest, userAddress, quoteId);
    
    // Validate signature format
    const validatedSignature = validateSignature(signature);
    
    return {
      order: order,
      signature: validatedSignature,
      extension: "0x",          // Must be "0x", not "0x00"
      quoteId: quoteId || ""    // Quote ID if available
    };
  }
  
  // Fix your current order data
  export function fixOrderData(orderData: any): any {
    const fixes = {
      order: validateAndFormatOrder(orderData.order),
      signature: orderData.signature === "0x0000" ? 
        "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" : 
        validateSignature(orderData.signature),
      extension: "0x", // Fixed from "0x00" 
      quoteId: orderData.quoteId || ""
    };
    
    return fixes;
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
    8453: { // Base
      ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      WETH: '0x4200000000000000000000000000000000000006',
      DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
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
    // Base tokens
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913': { symbol: 'USDC', decimals: 6, name: 'USD Coin (Base)' },
    '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb': { symbol: 'DAI', decimals: 18, name: 'Dai (Base)' },
    // Optimism tokens
    '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85': { symbol: 'USDC', decimals: 6, name: 'USD Coin (Optimism)' },
    '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58': { symbol: 'USDT', decimals: 6, name: 'Tether (Optimism)' },
    '0x4200000000000000000000000000000000000006': { symbol: 'WETH', decimals: 18, name: 'Wrapped Ether (OP/Base)' },
    '0x4200000000000000000000000000000000000042': { symbol: 'OP', decimals: 18, name: 'Optimism' },
    '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1': { symbol: 'DAI', decimals: 18, name: 'Dai (OP/ARB)' },
    // Arbitrum tokens
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': { symbol: 'USDC', decimals: 6, name: 'USD Coin (Arbitrum)' },
    '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9': { symbol: 'USDT', decimals: 6, name: 'Tether (Arbitrum)' },
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': { symbol: 'WETH', decimals: 18, name: 'Wrapped Ether (Arbitrum)' },
    '0x912CE59144191C1204E64559FE8253a0e49E6548': { symbol: 'ARB', decimals: 18, name: 'Arbitrum' },
  };
  
  
  // EIP-712 domain and types for 1inch Fusion orders
  export const FUSION_ORDER_DOMAIN = {
    name: '1inch Fusion',
    version: '1',
    chainId: 1, // Will be dynamic based on selected chain
    verifyingContract: '0x0000000000000000000000000000000000000000' // Settlement contract address
  };
  
  export const FUSION_ORDER_TYPES = {
    Order: [
      { name: 'salt', type: 'uint256' },
      { name: 'makerAsset', type: 'address' },
      { name: 'takerAsset', type: 'address' },
      { name: 'maker', type: 'address' },
      { name: 'receiver', type: 'address' },
      { name: 'makingAmount', type: 'uint256' },
      { name: 'takingAmount', type: 'uint256' },
      { name: 'makerTraits', type: 'uint256' }
    ]
  };
  
  // Function to sign order using wallet (requires ethers or wagmi)
  export async function signOrderWithWallet(
    order: FusionOrder,
    walletSigner: any, // ethers Signer or wagmi wallet
    chainId: number
  ): Promise<string> {
    // Update domain with correct chainId
    const domain = {
      ...FUSION_ORDER_DOMAIN,
      chainId: chainId
    };
  
    try {
      // Sign using EIP-712
      const signature = await walletSigner._signTypedData(domain, FUSION_ORDER_TYPES, order);
      console.log('✅ Order signed successfully:', signature);
      return signature;
    } catch (error) {
      console.error('❌ Failed to sign order:', error);
      throw new Error(`Order signing failed: ${error}`);
    }
  }
  
  // Helper function to get token decimals
  export function getTokenDecimals(tokenAddress: string): number {
    const metadata = TOKEN_METADATA[tokenAddress.toLowerCase()];
    return metadata ? metadata.decimals : 18; // Default to 18 decimals
  }
  
  // ===== SIMPLE SWAP HELPER FUNCTIONS =====
  
  // Complete simple swap workflow
  export async function performSimpleSwap(
    api: OneInchQuoteAPI,
    swapParams: SwapRequest,
    executeTransaction: (tx: { to: string; data: string; value: string }) => Promise<string>
  ): Promise<{
    approvalTxHash?: string;
    swapTxHash: string;
  }> {
    console.log('🚀 Starting simple swap workflow...');
    
    const result: { approvalTxHash?: string; swapTxHash: string } = {
      swapTxHash: ''
    };
  
    try {
      // Step 1: Check allowance
      console.log('1️⃣ Checking token allowance...');
      const currentAllowance = await api.checkAllowance(swapParams.src, swapParams.from);
      const requiredAmount = BigInt(swapParams.amount);
      const allowanceBigInt = BigInt(currentAllowance);
  
      // Step 2: Approve if needed
      if (allowanceBigInt < requiredAmount) {
        console.log('2️⃣ Insufficient allowance, creating approval transaction...');
        const approvalTx = await api.getApprovalTransaction(swapParams.src, swapParams.amount);
        
        console.log('📝 Executing approval transaction...');
        const approvalTxHash = await executeTransaction({
          to: approvalTx.to,
          data: approvalTx.data,
          value: approvalTx.value
        });
        
        result.approvalTxHash = approvalTxHash;
        console.log('✅ Approval transaction sent:', approvalTxHash);
        
        // Wait for approval confirmation
        console.log('⏳ Waiting 10 seconds for approval confirmation...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      } else {
        console.log('✅ Sufficient allowance available');
      }
  
      // Step 3: Execute swap
      console.log('3️⃣ Creating swap transaction...');
      const swapTx = await api.getSwapTransaction(swapParams);
      
      console.log('📝 Executing swap transaction...');
      const swapTxHash = await executeTransaction({
        to: swapTx.tx.to,
        data: swapTx.tx.data,
        value: swapTx.tx.value
      });
      
      result.swapTxHash = swapTxHash;
      console.log('🎉 Swap transaction sent:', swapTxHash);
  
      return result;
  
    } catch (error) {
      console.error('❌ Simple swap failed:', error);
      throw error;
    }
  }
  
  // Helper to create swap params from your current UI state
  export function createSwapParamsFromUI(
    sellToken: { address: string; decimals: number },
    buyToken: { address: string; decimals: number },
    sellAmount: string,
    walletAddress: string,
    slippage: number = 1
  ): SwapRequest {
    // Convert UI amount to wei
    const amountInWei = parseTokenAmount(sellAmount, sellToken.decimals);
    
    return {
      src: sellToken.address,
      dst: buyToken.address,
      amount: amountInWei,
      from: walletAddress,
      slippage: slippage.toString(),
      disableEstimate: 'false',
      allowPartialFill: 'false'
    };
  }
  