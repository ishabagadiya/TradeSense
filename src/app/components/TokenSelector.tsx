'use client';

import { useState } from 'react';

interface TokenSelectorProps {
  onTokenSelect: (token: string) => void;
  loading?: boolean;
}

const popularTokens = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { symbol: 'SOL', name: 'Solana', icon: '◎' },
  { symbol: 'ADA', name: 'Cardano', icon: '₳' },
  { symbol: 'DOT', name: 'Polkadot', icon: '●' },
  { symbol: 'LINK', name: 'Chainlink', icon: '🔗' },
  { symbol: 'UNI', name: 'Uniswap', icon: '🦄' },
  { symbol: 'AVAX', name: 'Avalanche', icon: '🔺' },
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
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Select a Token to Get Price
      </h2>

      {/* Popular Tokens Grid */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Popular Tokens</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {popularTokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => handleTokenClick(token.symbol)}
              disabled={loading}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedToken === token.symbol
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-2xl">{token.icon}</span>
                <span className="font-semibold text-sm">{token.symbol}</span>
                <span className="text-xs text-gray-500">{token.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Token Input */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Custom Token</h3>
          <button
            onClick={handleCustomInputToggle}
            className="text-green-500 hover:text-green-600 text-sm font-medium"
          >
            {showCustomInput ? 'Hide' : 'Enter Custom Token'}
          </button>
        </div>

        {showCustomInput && (
          <form onSubmit={handleCustomTokenSubmit} className="flex gap-3">
            <input
              type="text"
              value={customToken}
              onChange={(e) => setCustomToken(e.target.value)}
              placeholder="Enter token symbol (e.g., DOGE, MATIC)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 focus:border-transparent shadow-sm transition-all duration-200"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !customToken.trim()}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-xl transition-colors duration-200"
            >
              {loading ? 'Loading...' : 'Get Price'}
            </button>
          </form>
        )}
      </div>

      {/* Selected Token Display */}
      {selectedToken && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-green-800">
            <span className="font-semibold">Selected Token:</span> {selectedToken}
          </p>
          {loading && (
            <p className="text-green-600 text-sm mt-1">Fetching price data...</p>
          )}
        </div>
      )}
    </div>
  );
}
