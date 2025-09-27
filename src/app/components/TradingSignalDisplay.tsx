'use client';

import { useState } from 'react';
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
  Info,
  Brain,
  Zap
} from 'lucide-react';

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

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getMarketConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'bullish':
        return 'text-green-600 bg-green-100';
      case 'bearish':
        return 'text-red-600 bg-red-100';
      case 'neutral':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
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

  const calculatePercentageChange = (targetPrice: number, currentPrice: number) => {
    return (((targetPrice - currentPrice) / currentPrice) * 100).toFixed(2);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-slate-600 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden group">
      {/* Subtle Background on Hover */}
      <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-300 flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          AI Trading Signal
        </h2>
        <button
          onClick={onGenerateSignal}
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Generate AI Signal
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl mb-6 shadow-lg relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <strong className="text-lg">Error:</strong>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16 relative z-10">
          <div className="text-center bg-white dark:bg-gray-800/50 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <span className="text-blue-800 dark:text-blue-300 font-semibold text-lg">AI is analyzing market data...</span>
            <p className="text-blue-600 dark:text-blue-400 text-sm mt-2">This may take a few seconds</p>
          </div>
        </div>
      )}

      {signal && !loading && (
        <div className="space-y-6 relative z-10">
          {/* Main Signal Card */}
          <div className={`bg-gradient-to-r ${getSignalColor(signal.signal)} p-6 rounded-xl text-white shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getSignalIcon(signal.signal)}
                <div>
                  <h3 className="text-3xl font-bold">{signal.signal.toUpperCase()} {signal.tokenSymbol}</h3>
                  <p className="text-white/90 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Generated Signal
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{signal.confidence}%</div>
                <p className="text-white/90 text-sm">Confidence</p>
              </div>
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
                <p className="text-white/80 text-sm">Risk/Reward</p>
                <p className="text-xl font-semibold">{calculateRiskReward() || 'N/A'}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Timeframe</p>
                <p className="text-xl font-semibold">{signal.signalTimeframe}</p>
              </div>
            </div>
          </div>

          {/* Market Analysis Tags */}
          <div className="flex flex-wrap gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(signal.riskLevel)}`}>
              Risk: {signal.riskLevel.toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMarketConditionColor(signal.marketCondition)}`}>
              Market: {signal.marketCondition.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30">
              Model: {signal.aiModel}
            </span>
          </div>

          {/* Trading Levels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Take Profit 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-green-50/50 dark:bg-green-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-slate-800 dark:text-slate-300">Take Profit 1</h4>
              </div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400 relative z-10">{formatPrice(signal.tp1)}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 relative z-10">
                {calculatePercentageChange(signal.tp1, signal.inputData.currentPrice) > '0' ? '+' : ''}
                {calculatePercentageChange(signal.tp1, signal.inputData.currentPrice)}%
              </p>
            </div>

            {/* Take Profit 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-green-50/50 dark:bg-green-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-slate-800 dark:text-slate-300">Take Profit 2</h4>
              </div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400 relative z-10">{formatPrice(signal.tp2)}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 relative z-10">
                {calculatePercentageChange(signal.tp2, signal.inputData.currentPrice) > '0' ? '+' : ''}
                {calculatePercentageChange(signal.tp2, signal.inputData.currentPrice)}%
              </p>
            </div>

            {/* Stop Loss */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-purple-50/50 dark:bg-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h4 className="font-semibold text-slate-800 dark:text-slate-300">Stop Loss</h4>
              </div>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-400 relative z-10">{formatPrice(signal.sl)}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 relative z-10">
                {calculatePercentageChange(signal.sl, signal.inputData.currentPrice)}%
              </p>
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-purple-50/50 dark:bg-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h4 className="font-semibold text-slate-800 dark:text-slate-300">AI Analysis & Reasoning</h4>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed relative z-10">{signal.reasoning}</p>
          </div>

          {/* Technical Details Toggle */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-2 transition-colors"
            >
              <Info className="w-4 h-4" />
              {showDetails ? 'Hide' : 'Show'} Technical Details
            </button>

            {showDetails && (
              <div className="mt-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Input Data</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Current Price:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{formatPrice(signal.inputData.currentPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">EMA Price:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{formatPrice(signal.inputData.emaPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">EMA Confidence:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">±{formatPrice(signal.inputData.emaConfidence)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Price Confidence:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">±{formatPrice(signal.inputData.priceConfidence)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Timeframe:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{signal.inputData.timeframe}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Signal Metadata</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Generated:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{formatTime(signal.timestamp)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Signal:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200 uppercase">{signal.signal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{signal.confidence}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Risk Level:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">{signal.riskLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">AI Model:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{signal.aiModel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!signal && !loading && !error && (
        <div className="text-center py-16 relative z-10">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Brain className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No AI Signal Generated</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Select a token and fetch its price data, then click &quot;Generate AI Signal&quot; to get intelligent trading insights
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4 max-w-md mx-auto">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                <strong>Powered by OpenRouter:</strong> Using advanced AI models to analyze market data and provide trading signals
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
