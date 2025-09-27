'use client';

import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TradingSignalDisplay from './TradingSignalDisplay';

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
  tp1: number;
  tp2: number;
  sl: number;
  signalTimeframe?: string;
  confidence?: number;
  reasoning?: string;
  timestamp: string;
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
    setLoading(true);
    setError(null);
    onDataFetch?.(true);
    
    try {
      const response = await fetch(`/api/pyth-data?token=${encodeURIComponent(token)}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result);
        toast.success(`${token.toUpperCase()} price fetched successfully!`);
      } else {
        setError(result.error || 'Failed to fetch price data');
        toast.error(result.error || 'Failed to fetch price data');
        setData(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
      setData(null);
    } finally {
      setLoading(false);
      onDataFetch?.(false);
    }
  };

  const generateTradingSignal = async () => {
    if (!data) {
      toast.error('Please fetch token price data first');
      return;
    }

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

      console.log('Generating signal with data:', signalData);

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
        toast.success(`Trading signal generated for ${data.token}!`);
      } else {
        setSignalError(result.error || 'Failed to generate trading signal');
        toast.error(result.error || 'Failed to generate trading signal');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setSignalError(errorMessage);
      toast.error(`Error generating signal: ${errorMessage}`);
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
      <div className="bg-gray-50 rounded-lg p-8 max-w-4xl mx-auto text-center">
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Token Price Display</h2>
        <p className="text-gray-500">Select a token above to view its current price from Pyth Network</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {data ? `${data.token} Price Data` : `${selectedToken.toUpperCase()} Price Data`}
        </h2>
        {selectedToken && (
          <button
            onClick={() => fetchTokenPrice(selectedToken)}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Loading...' : 'Refresh Price'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Fetching {selectedToken.toUpperCase()} price data...</span>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-6">
          {/* Main Price Display */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{data.tokenInfo.symbol}</h3>
                <p className="text-gray-600">{data.tokenInfo.base}</p>
                <p className="text-sm text-gray-500 mt-1">{data.tokenInfo.description}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-600 mb-1">
                  {formatPrice(data.priceData.price)}
                </div>
                <p className="text-sm text-gray-500">
                  ±{formatPrice(data.priceData.confidence)} confidence
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Last Updated</p>
                <p className="text-sm font-medium">{formatTime(data.priceData.publishTime)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Asset Type</p>
                <p className="text-sm font-medium">{data.tokenInfo.assetType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Price Expo</p>
                <p className="text-sm font-medium">{data.priceData.expo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Slot</p>
                <p className="text-sm font-medium">{data.metadata.slot.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* EMA Price Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Exponential Moving Average (EMA)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">EMA Price</p>
                <p className="text-xl font-bold text-blue-600">{formatPrice(data.emaPrice.price)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">EMA Confidence</p>
                <p className="text-lg font-semibold text-gray-700">±{formatPrice(data.emaPrice.confidence)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">EMA Updated</p>
                <p className="text-sm font-medium">{formatTime(data.emaPrice.publishTime)}</p>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Technical Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600"><strong>Price Feed ID:</strong></p>
                <code className="text-xs bg-white px-2 py-1 rounded border break-all">{data.priceId}</code>
              </div>
              <div>
                <p className="text-gray-600"><strong>Data Fetched:</strong> {new Date(data.timestamp).toLocaleString()}</p>
                <p className="text-gray-600"><strong>Proof Available:</strong> {formatTime(data.metadata.proof_available_time)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!data && !loading && !error && selectedToken && (
        <div className="text-center py-8">
          <p className="text-gray-500">Click "Refresh Price" to fetch {selectedToken.toUpperCase()} price data from Pyth Network</p>
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
