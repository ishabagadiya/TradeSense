'use client';

import { useState } from 'react';
import { Search, Zap, TrendingUp, Star } from 'lucide-react';

interface TokenSelectorProps {
  onTokenSelect: (token: string) => void;
  loading?: boolean;
}

const popularTokens = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: 'from-orange-400 to-orange-600' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: 'from-blue-400 to-blue-600' },
  { symbol: 'SOL', name: 'Solana', icon: '◎', color: 'from-purple-400 to-purple-600' },
  { symbol: 'ADA', name: 'Cardano', icon: '₳', color: 'from-blue-400 to-indigo-600' },
  { symbol: 'DOT', name: 'Polkadot', icon: '●', color: 'from-pink-400 to-pink-600' },
  { symbol: 'LINK', name: 'Chainlink', icon: '🔗', color: 'from-blue-500 to-cyan-500' },
  { symbol: 'UNI', name: 'Uniswap', icon: '🦄', color: 'from-pink-500 to-purple-500' },
  { symbol: 'AVAX', name: 'Avalanche', icon: '🔺', color: 'from-red-400 to-red-600' },
];

export default function TokenSelector({ onTokenSelect, loading = false }: TokenSelectorProps) {
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [customToken, setCustomToken] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleTokenClick = (token: string) => {
    setSelectedToken(token);
    setCustomToken('');
    setShowCustomInput(false);
    onTokenSelect(token);
  };

  const handleCustomTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customToken.trim()) {
      setSelectedToken(customToken.toUpperCase());
      onTokenSelect(customToken.trim());
    }
  };

  const handleCustomInputToggle = () => {
    setShowCustomInput(!showCustomInput);
    if (showCustomInput) {
      setCustomToken('');
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Select a Token to Analyze
        </h2>
        <p className="text-lg text-gray-600">Choose from popular cryptocurrencies or enter a custom symbol</p>
      </div>

      {/* Popular Tokens Grid */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-6">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="text-xl font-semibold text-gray-800">Popular Tokens</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularTokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => handleTokenClick(token.symbol)}
              disabled={loading}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                selectedToken === token.symbol
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${token.color} text-white shadow-md group-hover:shadow-lg transition-shadow`}>
                  <span className="text-2xl font-bold">{token.icon}</span>
                </div>
                <div className="text-center">
                  <span className="font-bold text-lg text-gray-800 block">{token.symbol}</span>
                  <span className="text-sm text-gray-500">{token.name}</span>
                </div>
              </div>
              {selectedToken === token.symbol && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Token Input */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" />
            <h3 className="text-xl font-semibold text-gray-800">Custom Token</h3>
          </div>
          <button
            onClick={handleCustomInputToggle}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {showCustomInput ? 'Hide' : 'Enter Custom Token'}
          </button>
        </div>

        {showCustomInput && (
          <form onSubmit={handleCustomTokenSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={customToken}
                onChange={(e) => setCustomToken(e.target.value)}
                placeholder="Enter token symbol (e.g., DOGE, MATIC, SHIB)"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !customToken.trim()}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-200 font-medium text-lg shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Loading...
                </div>
              ) : (
                'Analyze Token'
              )}
            </button>
          </form>
        )}
      </div>

      {/* Selected Token Display */}
      {selectedToken && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-blue-800 font-bold text-lg">
                  Selected: <span className="text-purple-700">{selectedToken}</span>
                </p>
                {loading && (
                  <p className="text-blue-600 text-sm flex items-center gap-2">
                    <p className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></p>
                    Fetching price data from Pyth Network...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
