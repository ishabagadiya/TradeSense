"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowUpDown } from 'lucide-react';

// Simple interface to test 1inch APIs step by step
const SimpleSwapInterface: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<any[]>([]);
  const [quote, setQuote] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [sellAmount, setSellAmount] = useState('1');
  const [buyAmount, setBuyAmount] = useState('');
  const [sellToken, setSellToken] = useState({
    symbol: 'WETH',
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: 18,
  });
  const [buyToken, setBuyToken] = useState({
    symbol: 'DAI',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
  });
  
  // Additional quote parameters
  const [walletAddress, setWalletAddress] = useState('0xa0f97344e9699F0D5d54c4158F9cf9892828C7F8');
  const [fee, setFee] = useState('0');
  const [showDestAmountMinusFee, setShowDestAmountMinusFee] = useState('true');
  const [surplus, setSurplus] = useState('true');
  const [enableEstimate, setEnableEstimate] = useState('false');

  const EXTERNAL_PROXY_URL = 'https://1inch-proxy-alpha.vercel.app';

  // Test 1: Fetch tokens from 1inch
  const testFetchTokens = async () => {
    console.log('🧪 Testing: Fetch Tokens');
    setLoading(true);
    setError(null);

    try {
      // Test tokens endpoint
      const url = `${EXTERNAL_PROXY_URL}/token/v1.2/multi-chain/trending-tokens?category=LISTING_NEW`;
      console.log('📡 Calling:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('📋 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Tokens API failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Tokens response:', data);

      // Convert to array format
      const tokenList = Object.values(data.tokens || {}).map((token: any) => ({
        symbol: token.symbol,
        address: token.address,
        decimals: token.decimals,
        name: token.name,
        logoURI: token.logoURI
      }));

      setTokens(tokenList);
      console.log('✅ Parsed tokens:', tokenList.length, 'tokens loaded');

    } catch (err: any) {
      console.error('❌ Tokens fetch failed:', err);
      setError(`Tokens fetch failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Main Get Quote functionality
  const handleGetQuote = async () => {
    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!sellToken.address || !sellToken.address.startsWith('0x')) {
      setError('Please enter a valid "From" token address');
      return;
    }

    if (!buyToken.address || !buyToken.address.startsWith('0x')) {
      setError('Please enter a valid "To" token address');
      return;
    }

    console.log('🚀 Getting quote...');
    setLoading(true);
    setError(null);

    try {
      // Calculate amount in wei
      const amountInWei = (parseFloat(sellAmount) * Math.pow(10, sellToken.decimals)).toString();
      console.log(`💰 Amount calculation: ${sellAmount} ${sellToken.symbol} = ${amountInWei} wei (${sellToken.decimals} decimals)`);
      
      // Build Fusion API URL with user inputs
      const params = new URLSearchParams({
        fromTokenAddress: sellToken.address,
        toTokenAddress: buyToken.address,
        amount: amountInWei,
        walletAddress: walletAddress,
        enableEstimate: enableEstimate,
        fee: fee,
        showDestAmountMinusFee: showDestAmountMinusFee,
        surplus: surplus,
      });
      
      console.log('📋 Quote parameters:', params.toString());
      const url = `${EXTERNAL_PROXY_URL}/fusion/quoter/v2.0/1/quote/receive?${params}`;
      console.log('📡 Calling:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('📋 Response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorText;
        try {
          const errorData = await response.json();
          errorText = errorData.error || errorData.message || JSON.stringify(errorData);
        } catch {
          errorText = await response.text();
        }
        throw new Error(`Quote API failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Quote response:', data);

      setQuote(data);
      
      // Calculate buy amount
      if (data.dstAmount) {
        const buyAmountFormatted = (parseInt(data.dstAmount) / Math.pow(10, buyToken.decimals)).toFixed(6);
        setBuyAmount(buyAmountFormatted);
        console.log('✅ Buy amount calculated:', buyAmountFormatted);
      }

    } catch (err: any) {
      console.error('❌ Quote fetch failed:', err);
      setError(`Quote failed: ${err.message}`);
      
      // Also log the full request for debugging
      console.error('Failed request details:', {
        sellToken,
        buyToken,
        sellAmount,
        walletAddress,
        fee,
        surplus,
        enableEstimate,
        showDestAmountMinusFee
      });
    } finally {
      setLoading(false);
    }
  };

  // Test 2: Get quote from 1inch Fusion API
  const testGetQuote = async () => {
    console.log('🧪 Testing: Get Quote');
    setLoading(true);
    setError(null);

    try {
      // Build Fusion API URL using form values
      const params = new URLSearchParams({
        fromTokenAddress: sellToken.address,
        toTokenAddress: buyToken.address,
        amount: (parseFloat(sellAmount) * Math.pow(10, sellToken.decimals)).toString(),
        walletAddress: walletAddress,
        enableEstimate: enableEstimate,
        fee: fee,
        showDestAmountMinusFee: showDestAmountMinusFee,
        surplus: surplus,
      });
      
      // Only add optional parameters if they have values
      // isPermit2 and permit are omitted when empty
console.log(params);
      const url = `${EXTERNAL_PROXY_URL}/fusion/quoter/v2.0/1/quote/receive?${params}`;
      console.log('📡 Calling:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('📋 Response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorText;
        try {
          const errorData = await response.json();
          errorText = errorData.error || errorData.message || JSON.stringify(errorData);
        } catch {
          errorText = await response.text();
        }
        throw new Error(`Quote API failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Quote response:', data);

      setQuote(data);
      
      // Calculate buy amount
      if (data.dstAmount) {
        const buyAmountFormatted = (parseInt(data.dstAmount) / Math.pow(10, buyToken.decimals)).toFixed(6);
        setBuyAmount(buyAmountFormatted);
        console.log('✅ Buy amount calculated:', buyAmountFormatted);
      }

    } catch (err: any) {
      console.error('❌ Quote fetch failed:', err);
      setError(`Quote fetch failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  // Swap tokens
  const handleSwapDirection = () => {
    setSellToken(buyToken);
    setBuyToken(sellToken);
    setSellAmount(buyAmount || '0.1');
    setBuyAmount('');
    setQuote(null);
    setError(null);
  };

  // Reset quote when amount changes
  const handleAmountChange = (value: string) => {
    setSellAmount(value);
    setBuyAmount('');
    setQuote(null);
    setError(null);
  };

  // Reset quote when token addresses change
  const handleSellTokenChange = (field: string, value: string | number) => {
    setSellToken({...sellToken, [field]: value});
    setBuyAmount('');
    setQuote(null);
    setError(null);
  };

  const handleBuyTokenChange = (field: string, value: string | number) => {
    setBuyToken({...buyToken, [field]: value});
    setBuyAmount('');
    setQuote(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Simple Swap Interface</h2>
        <p className="text-gray-600">Step-by-step testing of 1inch APIs</p>
      </div>

      {/* API Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <button
          onClick={testFetchTokens}
          disabled={loading}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Test 1: Token API'}
        </button>
        
        <button
          onClick={testGetQuote}
          disabled={loading}
          className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Test 2: Fusion Quote'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error:</p>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Swap Interface */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Swap Preview</h3>
        
        {/* Sell Token */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">You Pay</label>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={sellAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.0"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="px-3 py-2 bg-gray-100 rounded-lg font-medium">
              {sellToken.symbol}
            </div>
          </div>
          
          {/* Sell Token Address Input */}
          <div className="mt-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">From Token Address</label>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Contract Address</label>
                <input
                  type="text"
                  value={sellToken.address}
                  onChange={(e) => handleSellTokenChange('address', e.target.value)}
                  placeholder="0x... (token contract address)"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Symbol</label>
                  <input
                    type="text"
                    value={sellToken.symbol}
                    onChange={(e) => handleSellTokenChange('symbol', e.target.value)}
                    placeholder="Symbol"
                    className="w-20 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Decimals</label>
                  <input
                    type="number"
                    value={sellToken.decimals}
                    onChange={(e) => handleSellTokenChange('decimals', parseInt(e.target.value) || 18)}
                    placeholder="18"
                    min="0"
                    max="18"
                    className="w-16 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Direction */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSwapDirection}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Buy Token */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">You Receive</label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={buyAmount}
              readOnly
              placeholder="0.0"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
            <div className="px-3 py-2 bg-gray-100 rounded-lg font-medium">
              {buyToken.symbol}
            </div>
          </div>
          
          {/* Buy Token Address Input */}
          <div className="mt-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">To Token Address</label>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Contract Address</label>
                <input
                  type="text"
                  value={buyToken.address}
                  onChange={(e) => handleBuyTokenChange('address', e.target.value)}
                  placeholder="0x... (token contract address)"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Symbol</label>
                  <input
                    type="text"
                    value={buyToken.symbol}
                    onChange={(e) => handleBuyTokenChange('symbol', e.target.value)}
                    placeholder="Symbol"
                    className="w-20 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Decimals</label>
                  <input
                    type="number"
                    value={buyToken.decimals}
                    onChange={(e) => handleBuyTokenChange('decimals', parseInt(e.target.value) || 18)}
                    placeholder="18"
                    min="0"
                    max="18"
                    className="w-16 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Get Quote Button */}
        <div className="mt-6">
          <button
            onClick={handleGetQuote}
            disabled={loading || !sellAmount || parseFloat(sellAmount) <= 0 || !sellToken.address || !buyToken.address}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
              loading || !sellAmount || parseFloat(sellAmount) <= 0 || !sellToken.address || !buyToken.address
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                Getting Quote...
              </div>
            ) : (
              'Get Quote'
            )}
          </button>
        </div>
      </div>

      {/* Advanced Parameters */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Advanced Parameters</h3>
        
        {/* Wallet Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Fee and Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fee</label>
            <input
              type="text"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Show Dest Amount Minus Fee</label>
            <select
              value={showDestAmountMinusFee}
              onChange={(e) => setShowDestAmountMinusFee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Surplus</label>
            <select
              value={surplus}
              onChange={(e) => setSurplus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enable Estimate</label>
            <select
              value={enableEstimate}
              onChange={(e) => setEnableEstimate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="false">False</option>
              <option value="true">True</option>
            </select>
          </div>
        </div>
      </div>

      {/* Common Tokens Helper */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Common Tokens (Ethereum)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { symbol: 'WETH', address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', decimals: 18 },
            { symbol: 'USDC', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals: 6 },
            { symbol: 'USDT', address: '0xdac17f958d2ee523a2206206994597c13d831ec7', decimals: 6 },
            { symbol: 'DAI', address: '0x6b175474e89094c44da98b954eedeac495271d0f', decimals: 18 },
            { symbol: 'WBTC', address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', decimals: 8 },
            { symbol: 'UNI', address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', decimals: 18 }
          ].map((token) => (
            <div key={token.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{token.symbol}</p>
                <p className="text-xs text-gray-500 font-mono">{token.address}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSellToken({...token})}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Set From
                </button>
                <button
                  onClick={() => setBuyToken({...token})}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Set To
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Display */}
      <div className="space-y-4">
        {/* Tokens Results */}
        {tokens.length > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">✅ Tokens Loaded</h4>
            <p className="text-sm text-blue-800">Found {tokens.length} tokens</p>
            <details className="mt-2">
              <summary className="text-xs text-blue-700 cursor-pointer">Show first 5 tokens</summary>
              <pre className="text-xs text-blue-600 mt-2 overflow-x-auto">
                {JSON.stringify(tokens.slice(0, 5), null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Quote Results */}
        {quote && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">✅ Quote Received</h4>
            <div className="text-sm text-green-800 space-y-1">
              <p><strong>Rate:</strong> 1 {sellToken.symbol} = {buyAmount} {buyToken.symbol}</p>
              {quote.gas && <p><strong>Estimated Gas:</strong> {quote.gas}</p>}
              {quote.protocols && <p><strong>Protocols:</strong> {quote.protocols.length} routes</p>}
            </div>
            <details className="mt-2">
              <summary className="text-xs text-green-700 cursor-pointer">Show full quote</summary>
              <pre className="text-xs text-green-600 mt-2 overflow-x-auto">
                {JSON.stringify(quote, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      {/* API Info */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">API Testing Status</h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Proxy URL:</strong> {EXTERNAL_PROXY_URL}</p>
          <p><strong>Test 1:</strong> Token API - {tokens.length > 0 ? '✅ Working' : '❌ Not tested'}</p>
          <p><strong>Test 2:</strong> Fusion Quote - {quote ? '✅ Working' : '❌ Not tested'}</p>
          <p><strong>Console:</strong> Check browser console for detailed logs</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleSwapInterface;
