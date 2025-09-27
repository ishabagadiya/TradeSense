'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Activity, DollarSign, Globe, Volume2 } from 'lucide-react';
import { Token, formatPrice, formatChange, formatMarketCap } from '../../lib/tokens';

interface TokenDetailsScreenProps {
  token: Token;
  onBack: () => void;
}

const TokenDetailsScreen: React.FC<TokenDetailsScreenProps> = ({ token, onBack }) => {
  const stats = [
    {
      label: 'Price',
      value: formatPrice(token.price),
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
            
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300">
                  Trend Analysis
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Bullish pattern forming
                </p>
              </div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
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
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-200 shadow-lg hover:shadow-xl">
          Start Analysis
        </button>
        <button className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-200">
          View Historical Data
        </button>
      </motion.div>
    </motion.div>
  );
};

export default TokenDetailsScreen;
