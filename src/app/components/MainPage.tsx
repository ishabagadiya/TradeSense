import React from 'react'
import SimpleQuoteInterface from './SimpleQuoteInterface'
import SimpleSwapInterface from './SimpleSwapInterface'

const MainPage = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          1inch Quote API Integration
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get real-time token swap quotes from 1inch Protocol. 
          Simply enter token addresses, amounts, and fees to receive optimal routing and pricing information.
        </p>
      </div>
      
      <div className="space-y-8 mb-12">
        <div className="flex justify-center">
          <SimpleSwapInterface />
        </div>
        <div className="flex justify-center">
          <SimpleQuoteInterface />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <img src="/assets/1inch.svg" alt="1inch" className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">1inch Protocol</h3>
          <p className="text-gray-600">
            Best rates across 300+ DEXs with optimal routing and gas efficiency.
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Quotes</h3>
          <p className="text-gray-600">
            Get instant quotes with current market prices and optimal swap routes.
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔗</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-chain</h3>
          <p className="text-gray-600">
            Support for Ethereum, Optimism, Arbitrum, and other EVM networks.
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🛠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Developer Ready</h3>
          <p className="text-gray-600">
            Clean TypeScript API with comprehensive error handling and utilities.
          </p>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-gray-50 rounded-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-semibold">1</div>
            <h4 className="font-medium text-gray-900 mb-2">Select Network</h4>
            <p className="text-sm text-gray-600">Choose your preferred blockchain network (Ethereum, Optimism, or Arbitrum)</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-semibold">2</div>
            <h4 className="font-medium text-gray-900 mb-2">Enter Details</h4>
            <p className="text-sm text-gray-600">Provide source/destination token addresses, amount, and optional fees</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-semibold">3</div>
            <h4 className="font-medium text-gray-900 mb-2">Get Quote</h4>
            <p className="text-sm text-gray-600">Receive optimal routing, pricing, and gas estimates from 1inch</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage