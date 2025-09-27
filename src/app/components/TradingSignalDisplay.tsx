'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Shield, 
  Clock, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

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

interface TradingSignalDisplayProps {
  signal: TradingSignal | null;
  loading: boolean;
  error: string | null;
  onGenerateSignal: () => void;
}

export default function TradingSignalDisplay({ 
  signal, 
  loading, 
  error, 
  onGenerateSignal 
}: TradingSignalDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getSignalIcon = (signalType: string) => {
    switch (signalType?.toLowerCase()) {
      case 'buy':
        return <TrendingUp className="w-6 h-6 text-green-500" />;
      case 'sell':
        return <TrendingDown className="w-6 h-6 text-red-500" />;
      case 'hold':
        return <Minus className="w-6 h-6 text-yellow-500" />;
      default:
        return <BarChart3 className="w-6 h-6 text-gray-500" />;
    }
  };

  const getSignalColor = (signalType: string) => {
    switch (signalType?.toLowerCase()) {
      case 'buy':
        return 'from-green-400 to-green-600';
      case 'sell':
        return 'from-red-400 to-red-600';
      case 'hold':
        return 'from-yellow-400 to-yellow-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getSignalBorderColor = (signalType: string) => {
    switch (signalType?.toLowerCase()) {
      case 'buy':
        return 'border-green-200';
      case 'sell':
        return 'border-red-200';
      case 'hold':
        return 'border-yellow-200';
      default:
        return 'border-gray-200';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const calculateRiskReward = () => {
    if (!signal || !signal.inputData) return null;
    
    const { currentPrice } = signal.inputData;
    const { tp1, tp2, sl } = signal;
    
    const avgTP = (tp1 + tp2) / 2;
    const potentialProfit = Math.abs(avgTP - currentPrice);
    const potentialLoss = Math.abs(currentPrice - sl);
    
    return potentialLoss > 0 ? (potentialProfit / potentialLoss).toFixed(2) : 'N/A';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-blue-500" />
          AI Trading Signal
        </h2>
        <button
          onClick={onGenerateSignal}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              <BarChart3 className="w-4 h-4" />
              Generate Signal
            </>
          )}
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2"
        >
          <AlertTriangle className="w-5 h-5" />
          <div>
            <strong>Error:</strong> {error}
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Generating AI trading signal...</span>
        </div>
      )}

      {signal && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Main Signal Card */}
          <div className={`bg-gradient-to-r ${getSignalColor(signal.signal)} p-6 rounded-lg text-white shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getSignalIcon(signal.signal)}
                <div>
                  <h3 className="text-2xl font-bold">{signal.signal.toUpperCase()} {signal.tokenSymbol}</h3>
                  <p className="text-white/90">AI Generated Signal</p>
                </div>
              </div>
              {signal.confidence && (
                <div className="text-right">
                  <div className="text-3xl font-bold">{signal.confidence}%</div>
                  <p className="text-white/90 text-sm">Confidence</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-white/80 text-sm">Current Price</p>
                <p className="text-xl font-semibold">{formatPrice(signal.inputData.currentPrice)}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">EMA Price</p>
                <p className="text-xl font-semibold">{formatPrice(signal.inputData.emaPrice)}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Timeframe</p>
                <p className="text-xl font-semibold">{signal.signalTimeframe || signal.inputData.timeframe}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Risk/Reward</p>
                <p className="text-xl font-semibold">{calculateRiskReward() || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Trading Levels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Take Profit 1 */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Take Profit 1</h4>
              </div>
              <p className="text-2xl font-bold text-green-700">{formatPrice(signal.tp1)}</p>
              <p className="text-sm text-green-600">
                {signal.inputData.currentPrice < signal.tp1 ? '+' : ''}
                {(((signal.tp1 - signal.inputData.currentPrice) / signal.inputData.currentPrice) * 100).toFixed(2)}%
              </p>
            </div>

            {/* Take Profit 2 */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Take Profit 2</h4>
              </div>
              <p className="text-2xl font-bold text-green-700">{formatPrice(signal.tp2)}</p>
              <p className="text-sm text-green-600">
                {signal.inputData.currentPrice < signal.tp2 ? '+' : ''}
                {(((signal.tp2 - signal.inputData.currentPrice) / signal.inputData.currentPrice) * 100).toFixed(2)}%
              </p>
            </div>

            {/* Stop Loss */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-800">Stop Loss</h4>
              </div>
              <p className="text-2xl font-bold text-red-700">{formatPrice(signal.sl)}</p>
              <p className="text-sm text-red-600">
                {(((signal.sl - signal.inputData.currentPrice) / signal.inputData.currentPrice) * 100).toFixed(2)}%
              </p>
            </div>
          </div>

          {/* AI Reasoning */}
          {signal.reasoning && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">AI Analysis</h4>
              </div>
              <p className="text-blue-700">{signal.reasoning}</p>
            </div>
          )}

          {/* Technical Details Toggle */}
          <div className="border-t pt-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              {showDetails ? 'Hide' : 'Show'} Technical Details
            </button>

            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-gray-50 p-4 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">Input Data:</p>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>Current Price: {formatPrice(signal.inputData.currentPrice)}</li>
                      <li>EMA Price: {formatPrice(signal.inputData.emaPrice)}</li>
                      <li>EMA Confidence: {signal.inputData.emaConfidence}%</li>
                      <li>Price Confidence: ±{formatPrice(signal.inputData.priceConfidence)}</li>
                      <li>Timeframe: {signal.inputData.timeframe}</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Signal Details:</p>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>Generated: {formatTime(signal.timestamp)}</li>
                      <li>Signal Type: {signal.signal.toUpperCase()}</li>
                      {signal.confidence && <li>Confidence: {signal.confidence}%</li>}
                      {signal.signalTimeframe && <li>Signal Timeframe: {signal.signalTimeframe}</li>}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {!signal && !loading && !error && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No trading signal generated yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Select a token and click "Generate Signal" to get AI-powered trading insights
          </p>
        </div>
      )}
    </div>
  );
}
