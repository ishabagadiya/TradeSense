'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { TrendingUp } from 'lucide-react';
import TradingSignalDisplay from './TradingSignalDisplay';
import { contractService } from '../../lib/contractService';

interface TokenInfo {
  symbol: string;
  base: string;
  description: string;
  assetType: string;
}

interface PriceData {
  price: number;
  confidence: number;
  expo: number;
  publishTime: number;
  formattedPrice: string;
  formattedConfidence: string;
}

interface EmaPrice {
  price: number;
  confidence: number;
  expo: number;
  publishTime: number;
}

interface PythTokenData {
  success: boolean;
  token: string;
  priceId: string;
  tokenInfo: TokenInfo;
  priceData: PriceData;
  emaPrice: EmaPrice;
  metadata: {
    slot: number;
    proof_available_time: number;
    prev_publish_time: number;
  };
  timestamp: string;
  error?: string;
  details?: string;
}

interface TradingSignal {
  tokenSymbol: string;
  signal: 'buy' | 'sell' | 'hold';
  confidence: number;
  tp1: number;
  tp2: number;
  sl: number;
  reasoning: string;
  signalTimeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
  marketCondition: 'bullish' | 'bearish' | 'neutral';
  timestamp: string;
  aiModel: string;
  inputData: {
    symbol: string;
    currentPrice: number;
    emaPrice: number;
    emaConfidence: number;
    priceConfidence: number;
    timeframe: string;
  };
}

interface PythDataDisplayProps {
  selectedToken: string | null;
  onDataFetch?: (loading: boolean) => void;
}

export default function PythDataDisplay({ selectedToken, onDataFetch }: PythDataDisplayProps) {
  const [data, setData] = useState<PythTokenData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Trading signal states
  const [tradingSignal, setTradingSignal] = useState<TradingSignal | null>(null);
  const [signalLoading, setSignalLoading] = useState(false);
  const [signalError, setSignalError] = useState<string | null>(null);

  const fetchTokenPrice = async (token: string) => {
    // Prevent duplicate calls
    if (loading) return;
    
    setLoading(true);
    setError(null);
    onDataFetch?.(true);
    
    try {
      const response = await fetch(`/api/pyth-data?token=${encodeURIComponent(token)}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result);
        toast.success(`${token.toUpperCase()} price fetched successfully!`, {
          toastId: `price-${token}`, // Prevent duplicate toasts
        });
      } else {
        setError(result.error || 'Failed to fetch price data');
        toast.error(result.error || 'Failed to fetch price data', {
          toastId: `error-${token}`,
        });
        setData(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`, {
        toastId: `fetch-error-${token}`,
      });
      setData(null);
    } finally {
      setLoading(false);
      onDataFetch?.(false);
    }
  };

  const generateTradingSignal = async () => {
    if (!data) {
      toast.error('Please fetch token price data first', {
        toastId: 'no-data-error',
      });
      return;
    }

    // Prevent duplicate calls
    if (signalLoading) return;

    setSignalLoading(true);
    setSignalError(null);
    
    try {
      const signalData = {
        symbol: data.token,
        currentPrice: data.priceData.price,
        emaPrice: data.emaPrice.price,
        emaConfidence: data.emaPrice.confidence,
        priceConfidence: data.priceData.confidence,
        timeframe: '24h' // Default timeframe as requested
      };

      console.log('Generating AI signal with data:', signalData);

      const response = await fetch('/api/generate-signal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signalData),
      });

      const result = await response.json();

      if (result.success && result.tradingSignal) {
        setTradingSignal(result.tradingSignal);
        toast.success(`AI trading signal generated for ${data.token}!`, {
          toastId: `signal-generated-${data.token}`,
        });

        // Store signal in 0G Newton Testnet contract
        try {
          const txHash = await contractService.storeSignal({
            tokenSymbol: result.tradingSignal.tokenSymbol,
            signal: result.tradingSignal.signal,
            tp1: result.tradingSignal.tp1,
            tp2: result.tradingSignal.tp2,
            sl: result.tradingSignal.sl,
            signalTimeframe: result.tradingSignal.signalTimeframe,
            confidence: result.tradingSignal.confidence,
            reasoning: result.tradingSignal.reasoning
          });

          if (txHash) {
            toast.success(`Signal submitted to 0G Newton Testnet! TX: ${txHash.substring(0, 10)}...`, {
              toastId: `signal-stored-${data.token}`,
            });
            console.log(`Full transaction hash: ${txHash}`);
            console.log(`View transaction: https://chainscan-galileo.0g.ai/tx/${txHash}`);
          }
        } catch (contractError) {
          console.error('Failed to store signal on contract:', contractError);
          
          // Check if it's a network/connection error vs actual failure
          const errorMessage = contractError instanceof Error ? contractError.message : String(contractError);
          
          if (errorMessage.includes('no matching receipts') || 
              errorMessage.includes('timeout') || 
              errorMessage.includes('network') ||
              errorMessage.includes('connection')) {
            toast.info('Signal generated! Blockchain storage may be delayed due to network conditions.', {
              toastId: `storage-delayed-${data.token}`,
            });
          } else {
            toast.warning('Signal generated but failed to store on 0G Newton Testnet', {
              toastId: `storage-warning-${data.token}`,
            });
          }
        }
      } else {
        setSignalError(result.error || 'Failed to generate trading signal');
        toast.error(result.error || 'Failed to generate trading signal', {
          toastId: `signal-error-${data.token}`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setSignalError(errorMessage);
      toast.error(`Error generating signal: ${errorMessage}`, {
        toastId: `signal-generation-error-${data.token}`,
      });
    } finally {
      setSignalLoading(false);
    }
  };

  // Fetch data when selectedToken changes
  useEffect(() => {
    if (selectedToken) {
      fetchTokenPrice(selectedToken);
      // Clear previous trading signal when token changes
      setTradingSignal(null);
      setSignalError(null);
    }
  }, [selectedToken]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  };

  if (!selectedToken) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-lg p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300">Token Price Display</h2>
        </div>
        <p className="text-blue-600 dark:text-blue-400">Select a token above to view its current price from Pyth Network</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300">
            {data ? `${data.token} Price Data` : `${selectedToken.toUpperCase()} Price Data`}
          </h2>
        </div>
        {selectedToken && (
          <button
            onClick={() => fetchTokenPrice(selectedToken)}
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </div>
            ) : 'Refresh Price'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl mb-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">!</span>
            </div>
            <div>
              <strong className="text-lg">Error:</strong>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 bg-white dark:bg-gray-800/50 rounded-xl border-2 border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <div className="text-center">
              <p className="text-blue-800 dark:text-blue-300 font-semibold text-lg">Fetching {selectedToken.toUpperCase()} price data...</p>
              <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">From Pyth Network</p>
            </div>
          </div>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-6">
          {/* Main Price Display */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden group">
            {/* Subtle Background on Hover */}
            <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-300">{data.tokenInfo.symbol}</h3>
                <p className="text-blue-600 dark:text-blue-400 text-lg font-medium">{data.tokenInfo.base}</p>
                <p className="text-sm text-blue-500 dark:text-blue-400 mt-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full inline-block">
                  {data.tokenInfo.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {formatPrice(data.priceData.price)}
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                  ±{formatPrice(data.priceData.confidence)} confidence
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t-2 border-blue-200 dark:border-blue-700">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide font-semibold">Last Updated</p>
                <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mt-1">{formatTime(data.priceData.publishTime)}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl">
                <p className="text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wide font-semibold">Asset Type</p>
                <p className="text-sm font-bold text-purple-800 dark:text-purple-300 mt-1">{data.tokenInfo.assetType}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl">
                <p className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wide font-semibold">Price Expo</p>
                <p className="text-sm font-bold text-green-800 dark:text-green-300 mt-1">{data.priceData.expo}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-xl">
                <p className="text-xs text-orange-600 dark:text-orange-400 uppercase tracking-wide font-semibold">Slot</p>
                <p className="text-sm font-bold text-orange-800 dark:text-orange-300 mt-1">{data.metadata.slot.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* EMA Price Section */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden group">
            {/* Subtle Background on Hover */}
            <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-xl font-bold text-purple-800 dark:text-purple-300">Exponential Moving Average (EMA)</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide">EMA Price</p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-300 mt-2">{formatPrice(data.emaPrice.price)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">EMA Confidence</p>
                <p className="text-xl font-bold text-blue-800 dark:text-blue-300 mt-2">±{formatPrice(data.emaPrice.confidence)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl border border-green-200 dark:border-green-700">
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide">EMA Updated</p>
                <p className="text-sm font-bold text-green-800 dark:text-green-300 mt-2">{formatTime(data.emaPrice.publishTime)}</p>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden group">
            {/* Subtle Background on Hover */}
            <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚙️</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-300">Technical Details</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Price Feed ID:</p>
                <code className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg border break-all block">{data.priceId}</code>
              </div>
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Data Fetched:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{new Date(data.timestamp).toLocaleString()}</p>
                <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Proof Available:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{formatTime(data.metadata.proof_available_time)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!data && !loading && !error && selectedToken && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden group">
          {/* Subtle Background on Hover */}
          <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="flex items-center justify-center gap-3 mb-4 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">Ready to Fetch Data</h3>
          </div>
          <p className="text-blue-600 dark:text-blue-400 relative z-10">Click &quot;Refresh Price&quot; to fetch {selectedToken.toUpperCase()} price data from Pyth Network</p>
        </div>
      )}

      {/* Trading Signal Section */}
      {data && !loading && (
        <div className="mt-8">
          <TradingSignalDisplay
            signal={tradingSignal}
            loading={signalLoading}
            error={signalError}
            onGenerateSignal={generateTradingSignal}
          />
        </div>
      )}
    </div>
  );
}
