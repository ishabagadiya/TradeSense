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
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          AI Trading Signal
        </h2>
        <button
          onClick={onGenerateSignal}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <div>
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <span className="text-gray-600 text-lg">AI is analyzing market data...</span>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        </div>
      )}

      {signal && !loading && (
        <div className="space-y-6">
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
            <span className="px-3 py-1 rounded-full text-sm font-medium text-blue-600 bg-blue-100">
              Model: {signal.aiModel}
            </span>
          </div>

          {/* Trading Levels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Take Profit 1 */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Take Profit 1</h4>
              </div>
              <p className="text-2xl font-bold text-green-700">{formatPrice(signal.tp1)}</p>
              <p className="text-sm text-green-600">
                {calculatePercentageChange(signal.tp1, signal.inputData.currentPrice) > '0' ? '+' : ''}
                {calculatePercentageChange(signal.tp1, signal.inputData.currentPrice)}%
              </p>
            </div>

            {/* Take Profit 2 */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Take Profit 2</h4>
              </div>
              <p className="text-2xl font-bold text-green-700">{formatPrice(signal.tp2)}</p>
              <p className="text-sm text-green-600">
                {calculatePercentageChange(signal.tp2, signal.inputData.currentPrice) > '0' ? '+' : ''}
                {calculatePercentageChange(signal.tp2, signal.inputData.currentPrice)}%
              </p>
            </div>

            {/* Stop Loss */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-800">Stop Loss</h4>
              </div>
              <p className="text-2xl font-bold text-red-700">{formatPrice(signal.sl)}</p>
              <p className="text-sm text-red-600">
                {calculatePercentageChange(signal.sl, signal.inputData.currentPrice)}%
              </p>
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">AI Analysis & Reasoning</h4>
            </div>
            <p className="text-blue-700 leading-relaxed">{signal.reasoning}</p>
          </div>

          {/* Technical Details Toggle */}
          <div className="border-t pt-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
            >
              <Info className="w-4 h-4" />
              {showDetails ? 'Hide' : 'Show'} Technical Details
            </button>

            {showDetails && (
              <div className="mt-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-3">Input Data</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Price:</span>
                        <span className="font-medium">{formatPrice(signal.inputData.currentPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">EMA Price:</span>
                        <span className="font-medium">{formatPrice(signal.inputData.emaPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">EMA Confidence:</span>
                        <span className="font-medium">±{formatPrice(signal.inputData.emaConfidence)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price Confidence:</span>
                        <span className="font-medium">±{formatPrice(signal.inputData.priceConfidence)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timeframe:</span>
                        <span className="font-medium">{signal.inputData.timeframe}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-3">Signal Metadata</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Generated:</span>
                        <span className="font-medium">{formatTime(signal.timestamp)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Signal:</span>
                        <span className="font-medium uppercase">{signal.signal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-medium">{signal.confidence}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Level:</span>
                        <span className="font-medium capitalize">{signal.riskLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">AI Model:</span>
                        <span className="font-medium">{signal.aiModel}</span>
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
        <div className="text-center py-16">
          <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Brain className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No AI Signal Generated</h3>
          <p className="text-gray-500 mb-4">
            Select a token and fetch its price data, then click "Generate AI Signal" to get intelligent trading insights
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-700">
              <strong>Powered by OpenRouter:</strong> Using advanced AI models to analyze market data and provide trading signals
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
