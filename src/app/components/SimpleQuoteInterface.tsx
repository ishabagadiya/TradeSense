"use client";

import React, { useState } from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';
import OneInchQuoteAPI, { 
  QuoteRequest, 
  QuoteResponse, 
  COMMON_TOKENS, 
  TOKEN_METADATA,
  formatTokenAmount, 
  parseTokenAmount,
  getTokenDecimals
} from '@/lib/1inch-api';
import { debugProxy } from '@/lib/debug-proxy';

const SimpleQuoteInterface: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [chainId, setChainId] = useState(1); // Default to Ethereum
  const [srcToken, setSrcToken] = useState('');
  const [dstToken, setDstToken] = useState('');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState<string>('100'); // Fee in basis points (100 = 1%)
  const [walletAddress, setWalletAddress] = useState('0x0000000000000000000000000000000000000000');

  const api = new OneInchQuoteAPI(chainId);

  const handleGetQuote = async () => {
    if (!srcToken || !dstToken || !amount) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get proper decimals for source token
      const srcDecimals = getTokenDecimals(srcToken);
      const amountInWei = parseTokenAmount(amount, srcDecimals);
      
      const request: QuoteRequest = {
        fromTokenAddress: srcToken,
        toTokenAddress: dstToken,
        amount: amountInWei,
        walletAddress: walletAddress,
        enableEstimate: 'false',
        fee: fee || '0',
        showDestAmountMinusFee: '100000',
        isPermit2: '',
        surplus: 'true',
        permit: '',
      };

      console.log('Making quote request:', request);
      
      // Show the external proxy URL that will be called directly  
      const proxyUrl = `https://1inch-proxy-alpha.vercel.app/fusion/quoter/v2.0/${chainId}/quote/receive?fromTokenAddress=${request.fromTokenAddress}&toTokenAddress=${request.toTokenAddress}&amount=${request.amount}&walletAddress=${request.walletAddress}&enableEstimate=${request.enableEstimate}&fee=${request.fee}&showDestAmountMinusFee=${request.showDestAmountMinusFee}&isPermit2=${request.isPermit2}&surplus=${request.surplus}&permit=${request.permit}`;
      console.log('External Proxy API URL (Fusion v2.0):', proxyUrl);
      
      // Try to make the API call via proxy
      try {
        const quoteResponse = await api.getQuote(request);
        setQuote(quoteResponse);
        console.log('✅ External proxy API call succeeded!', quoteResponse);
        setError(null);
      } catch (apiError: any) {
        console.error('❌ External proxy API call failed:', apiError);
        console.error('❌ Full error details:', {
          message: apiError.message,
          stack: apiError.stack,
          requestUrl: proxyUrl
        });
        
        // Fall back to mock data for demonstration
        const mockQuote: QuoteResponse = {
          dstAmount: srcToken === COMMON_TOKENS[chainId as keyof typeof COMMON_TOKENS]?.WETH && 
                     dstToken === COMMON_TOKENS[chainId as keyof typeof COMMON_TOKENS]?.DAI
                     ? '2500000000000000000000' // ~2500 DAI for WETH (realistic rate)
                     : '2500000000000000000000', // 2500 tokens as fallback
          srcToken: {
            address: request.fromTokenAddress,
            symbol: TOKEN_METADATA[request.fromTokenAddress]?.symbol || 'SRC',
            name: TOKEN_METADATA[request.fromTokenAddress]?.name || 'Source Token',
            decimals: TOKEN_METADATA[request.fromTokenAddress]?.decimals || 18,
          },
          dstToken: {
            address: request.toTokenAddress,
            symbol: TOKEN_METADATA[request.toTokenAddress]?.symbol || 'DST',
            name: TOKEN_METADATA[request.toTokenAddress]?.name || 'Destination Token',
            decimals: TOKEN_METADATA[request.toTokenAddress]?.decimals || 18,
          },
          protocols: [
            [
              {
                name: 'UNISWAP_V3',
                part: 100,
                fromTokenAddress: request.fromTokenAddress,
                toTokenAddress: request.toTokenAddress,
              },
            ],
          ],
          gas: '150000',
        };
        
        setQuote(mockQuote);
        setError(`External proxy failed: ${apiError.message}. Showing mock data for demonstration.`);
      }
      
    } catch (err: any) {
      console.error('Quote error:', err);
      setError(err.message || 'Failed to get quote');
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  const fillExampleData = () => {
    const tokens = COMMON_TOKENS[chainId as keyof typeof COMMON_TOKENS];
    if (tokens) {
      setSrcToken(tokens.WETH); // WETH as example (matches your config)
      setDstToken(tokens.DAI || tokens.USDC);  // DAI if available, otherwise USDC
      setAmount('100000'); // Example amount (matches your config)
      setFee('100'); // 1% fee in basis points (matches your config)
      setWalletAddress('0x0000000000000000000000000000000000000000'); // Zero address for estimation
      setError(null);
      setQuote(null);
    }
  };

  return (
    // <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
    //   <div className="mb-6">
    //     <h2 className="text-2xl font-bold text-gray-900 mb-2">1inch Quote API</h2>
    //     <p className="text-gray-600">Get token swap quotes from 1inch Protocol</p>
    //   </div>

    //   {/* Chain Selection */}
    //   <div className="mb-4">
    //     <label className="block text-sm font-medium text-gray-700 mb-2">
    //       Blockchain Network
    //     </label>
    //     <select
    //       value={chainId}
    //       onChange={(e) => setChainId(Number(e.target.value))}
    //       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //     >
    //       <option value={1}>Ethereum Mainnet</option>
    //       <option value={10}>Optimism</option>
    //       <option value={42161}>Arbitrum One</option>
    //     </select>
    //   </div>

    //   {/* Token Addresses */}
    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    //     <div>
    //       <label className="block text-sm font-medium text-gray-700 mb-2">
    //         Source Token Address
    //       </label>
    //       <input
    //         type="text"
    //         value={srcToken}
    //         onChange={(e) => setSrcToken(e.target.value)}
    //         placeholder="0x... or paste token address"
    //         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //       />
    //       {srcToken && TOKEN_METADATA[srcToken] && (
    //         <p className="text-xs text-green-600 mt-1">
    //           ✓ {TOKEN_METADATA[srcToken].symbol} - {TOKEN_METADATA[srcToken].name} ({TOKEN_METADATA[srcToken].decimals} decimals)
    //         </p>
    //       )}
    //     </div>
    //     <div>
    //       <label className="block text-sm font-medium text-gray-700 mb-2">
    //         Destination Token Address
    //       </label>
    //       <input
    //         type="text"
    //         value={dstToken}
    //         onChange={(e) => setDstToken(e.target.value)}
    //         placeholder="0x... or paste token address"
    //         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //       />
    //       {dstToken && TOKEN_METADATA[dstToken] && (
    //         <p className="text-xs text-green-600 mt-1">
    //           ✓ {TOKEN_METADATA[dstToken].symbol} - {TOKEN_METADATA[dstToken].name} ({TOKEN_METADATA[dstToken].decimals} decimals)
    //         </p>
    //       )}
    //     </div>
    //   </div>

    //   {/* Amount, Fee and Wallet */}
    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    //     <div>
    //       <label className="block text-sm font-medium text-gray-700 mb-2">
    //         Amount
    //       </label>
    //       <input
    //         type="text"
    //         value={amount}
    //         onChange={(e) => setAmount(e.target.value)}
    //         placeholder="1"
    //         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //       />
    //     </div>
    //     <div>
    //       <label className="block text-sm font-medium text-gray-700 mb-2">
    //         Fee (basis points)
    //       </label>
    //       <input
    //         type="text"
    //         value={fee}
    //         onChange={(e) => setFee(e.target.value)}
    //         placeholder="100"
    //         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //       />
    //       <p className="text-xs text-gray-500 mt-1">100 = 1%, 50 = 0.5%</p>
    //     </div>
    //   </div>

    //   {/* Wallet Address */}
    //   <div className="mb-4">
    //     <label className="block text-sm font-medium text-gray-700 mb-2">
    //       Wallet Address
    //     </label>
    //     <input
    //       type="text"
    //       value={walletAddress}
    //       onChange={(e) => setWalletAddress(e.target.value)}
    //       placeholder="0x0000000000000000000000000000000000000000"
    //       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //     />
    //     <p className="text-xs text-gray-500 mt-1">Use zero address for quote estimation</p>
    //   </div>

    //   {/* Action Buttons */}
    //   <div className="flex gap-3 mb-6">
    //     <button
    //       onClick={handleGetQuote}
    //       disabled={loading || !srcToken || !dstToken || !amount}
    //       className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
    //         loading || !srcToken || !dstToken || !amount
    //           ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
    //           : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
    //       }`}
    //     >
    //       {loading ? (
    //         <div className="flex items-center justify-center">
    //           <RefreshCw className="w-5 h-5 animate-spin mr-2" />
    //           Getting Quote...
    //         </div>
    //       ) : (
    //         'Get Quote'
    //       )}
    //     </button>
        
    //     <button
    //       onClick={fillExampleData}
    //       className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
    //     >
    //       Fill Example
    //     </button>
        
    //     <button
    //       onClick={() => debugProxy()}
    //       className="px-4 py-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
    //     >
    //       Debug Proxy
    //     </button>
    //   </div>

    //   {/* Error Display */}
    //   {error && (
    //     <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
    //       <p className="text-red-800 font-medium">Error:</p>
    //       <p className="text-red-700">{error}</p>
    //     </div>
    //   )}

    //   {/* Quote Results */}
    //   {quote && (
    //     <div className="bg-gray-50 rounded-lg p-6">
    //       <h3 className="text-lg font-semibold text-gray-900 mb-4">Quote Results</h3>
          
    //       <div className="space-y-4">
    //         {/* Token Exchange Info */}
    //         <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
    //           <div className="text-center">
    //             <p className="text-sm text-gray-600">From</p>
    //             <p className="font-semibold text-gray-900">{quote.srcToken.symbol}</p>
    //             <p className="text-sm text-gray-500">{amount}</p>
    //           </div>
              
    //           <ArrowRight className="w-6 h-6 text-gray-400" />
              
    //           <div className="text-center">
    //             <p className="text-sm text-gray-600">To</p>
    //             <p className="font-semibold text-gray-900">{quote.dstToken.symbol}</p>
    //             <p className="text-sm text-gray-500">
    //               {formatTokenAmount(quote.dstAmount, quote.dstToken.decimals)}
    //             </p>
    //           </div>
    //         </div>

    //         {/* Quote Details */}
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //           <div className="p-3 bg-white rounded-lg border">
    //             <p className="text-sm text-gray-600">Estimated Gas</p>
    //             <p className="font-semibold text-gray-900">{quote.gas}</p>
    //           </div>
              
    //           <div className="p-3 bg-white rounded-lg border">
    //             <p className="text-sm text-gray-600">Number of Protocols</p>
    //             <p className="font-semibold text-gray-900">{quote.protocols.length}</p>
    //           </div>
    //         </div>

    //         {/* Protocol Details */}
    //         {quote.protocols.length > 0 && (
    //           <div className="p-4 bg-white rounded-lg border">
    //             <p className="text-sm font-medium text-gray-700 mb-2">Routing Protocols:</p>
    //             <div className="space-y-2">
    //               {quote.protocols.map((route, routeIndex) => (
    //                 <div key={routeIndex} className="text-sm">
    //                   <span className="text-gray-600">Route {routeIndex + 1}: </span>
    //                   {route.map((protocol, protocolIndex) => (
    //                     <span key={protocolIndex} className="text-gray-900">
    //                       {protocol.name}
    //                       {protocolIndex < route.length - 1 ? ' → ' : ''}
    //                     </span>
    //                   ))}
    //                 </div>
    //               ))}
    //             </div>
    //           </div>
    //         )}

    //         {/* Raw Response */}
    //         <details className="p-4 bg-white rounded-lg border">
    //           <summary className="text-sm font-medium text-gray-700 cursor-pointer">
    //             Raw API Response
    //           </summary>
    //           <pre className="mt-3 text-xs text-gray-600 overflow-x-auto">
    //             {JSON.stringify(quote, null, 2)}
    //           </pre>
    //         </details>
    //       </div>
    //     </div>
    //   )}

    //   {/* Common Tokens */}
    //   <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
    //     <h4 className="font-medium text-gray-900 mb-3">Common Token Addresses (Chain {chainId})</h4>
    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
    //       {Object.entries(COMMON_TOKENS[chainId as keyof typeof COMMON_TOKENS] || {}).map(([symbol, address]) => (
    //         <button
    //           key={symbol}
    //           onClick={() => navigator.clipboard.writeText(address)}
    //           className="text-left p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
    //           title="Click to copy address"
    //         >
    //           <div className="font-mono text-xs text-gray-600">{symbol}</div>
    //           <div className="font-mono text-xs text-gray-800 truncate">{address}</div>
    //         </button>
    //       ))}
    //     </div>
    //     <p className="text-xs text-gray-500 mt-2">💡 Click any token to copy its address</p>
    //   </div>

    //   {/* API Info */}
    //   <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    //     <h4 className="font-medium text-blue-900 mb-2">API Information</h4>
    //     <p className="text-sm text-blue-800">
    //       Using 1inch Fusion API v2.0 via External Proxy on chain ID {chainId}
    //     </p>
    //     <p className="text-xs text-blue-700 mt-1">
    //       Direct Endpoint: https://1inch-proxy-alpha.vercel.app/fusion/quoter/v2.0/{chainId}/quote/receive
    //     </p>
    //     <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
    //       <p className="text-xs text-green-800">
    //         <strong>🚀 1inch Fusion API v2.0:</strong> Using the latest Fusion API with your configured proxy. 
    //         Authorization is handled by your external proxy.
    //       </p>
    //     </div>
    //   </div>

    //   {/* Usage Instructions */}
    //   <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
    //     <h4 className="font-medium text-green-900 mb-2">Production Implementation</h4>
    //     <div className="text-sm text-green-800 space-y-2">
    //       <p><strong>1. Backend API Route:</strong> Create an API endpoint on your server</p>
    //       <p><strong>2. Server-side Calls:</strong> Make 1inch API calls from your backend</p>
    //       <p><strong>3. No CORS Issues:</strong> Server-to-server calls avoid browser restrictions</p>
    //       <p><strong>4. API Key:</strong> Add authentication for higher rate limits</p>
    //     </div>
    //     <div className="mt-3 p-2 bg-gray-800 rounded text-green-400 font-mono text-xs overflow-x-auto">
    //       curl -H "Authorization: Bearer YOUR_API_KEY" "https://api.1inch.io/v5.0/1/quote?fromTokenAddress=0xEeee...&toTokenAddress=0x6B17...&amount=1000000000000000000"
    //     </div>
    //   </div>
    // </div>
    <>
    </>
  );
};

export default SimpleQuoteInterface;
