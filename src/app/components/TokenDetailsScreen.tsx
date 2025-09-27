'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Activity, DollarSign, Globe, Volume2, RefreshCw, AlertCircle } from 'lucide-react';
import { Token, formatPrice, formatChange, formatMarketCap } from '../../lib/tokens';

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

interface TokenDetailsScreenProps {
  token: Token;
  onBack: () => void;
}

const TokenDetailsScreen: React.FC<TokenDetailsScreenProps> = ({ token, onBack }) => {
  const [pythData, setPythData] = useState<PythTokenData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPythData = async (tokenSymbol: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/pyth-data?token=${encodeURIComponent(tokenSymbol)}`);
      const result = await response.json();
      
      if (result.success) {
        setPythData(result);
      } else {
        setError(result.error || 'Failed to fetch price data');
        setPythData(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setPythData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Pyth data when component mounts
  useEffect(() => {
    if (token.symbol) {
      fetchPythData(token.symbol);
    }
  }, [token.symbol]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatPythPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  };

  const stats = [
    {
      label: 'Price',
      value: pythData ? formatPythPrice(pythData.priceData.price) : formatPrice(token.price),
      icon: DollarSign,
      color: 'text-blue-600'
    },
    {
      label: '24h Change',
      value: formatChange(token.change24h),
      icon: token.change24h >= 0 ? TrendingUp : TrendingDown,
      color: token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      label: 'Market Cap',
      value: formatMarketCap(token.marketCap),
      icon: Globe,
      color: 'text-purple-600'
    },
    {
      label: '24h Volume',
      value: formatMarketCap(token.volume24h),
      icon: Volume2,
      color: 'text-orange-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-full"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg">Back</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold text-white"
            style={{ backgroundColor: token.color }}
          >
            {token.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {token.name}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {token.symbol}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => fetchPythData(token.symbol)}
          disabled={loading}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-colors duration-200"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Loading...' : 'Refresh Price'}</span>
        </button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                stat.label === '24h Change' 
                  ? token.change24h >= 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {stat.label}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <strong>Error:</strong> {error}
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Fetching {token.symbol} price data from Pyth Network...</span>
          </div>
        </motion.div>
      )}

      {/* Pyth Data Display */}
      {pythData && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{pythData.tokenInfo.symbol}</h3>
                <p className="text-gray-600 dark:text-gray-400">{pythData.tokenInfo.base}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{pythData.tokenInfo.description}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {formatPythPrice(pythData.priceData.price)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ±{formatPythPrice(pythData.priceData.confidence)} confidence
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Last Updated</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatTime(pythData.priceData.publishTime)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Asset Type</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{pythData.tokenInfo.assetType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Price Expo</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{pythData.priceData.expo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Slot</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{pythData.metadata.slot.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* EMA Price Section */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mt-4">
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Exponential Moving Average (EMA)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">EMA Price</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatPythPrice(pythData.emaPrice.price)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">EMA Confidence</p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">±{formatPythPrice(pythData.emaPrice.confidence)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">EMA Updated</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatTime(pythData.emaPrice.publishTime)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Price Chart
            </h2>
          </div>
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                Chart will be implemented here
              </p>
            </div>
          </div>
        </div>

        {/* Trading Signals */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Trading Signals
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div>
                <p className="font-medium text-green-800 dark:text-green-300">
                  Strong Buy Signal
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  RSI indicates oversold condition
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-300">
                  Volume Spike
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Unusual trading activity detected
                </p>
              </div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div>
                <p className="font-medium text-green-800 dark:text-green-300">
                  Trend Analysis
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Bullish pattern forming
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 mt-8"
      >
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-200 shadow-lg hover:shadow-xl">
          Start Analysis
        </button>
        <button className="flex-1 bg-green-100 dark:bg-green-700 hover:bg-green-200 dark:hover:bg-green-600 text-green-900 dark:text-green-100 font-semibold py-4 px-6 rounded-2xl transition-colors duration-200">
          View Historical Data
        </button>
      </motion.div>
    </motion.div>
  );
};

export default TokenDetailsScreen;
