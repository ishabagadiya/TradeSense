"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MobileResponsiveMessage from "./components/MobileScreenPage";
import TokenSelector from "./components/TokenSelector";
import PythDataDisplay from "./components/PythDataDisplay";
import { Brain, Zap, Database, TrendingUp, Sparkles, ChevronRight, History } from "lucide-react";
import Orbit from "./components/Orbit";

export default function Home() {
  const router = useRouter();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTokenSelect = (token: string) => {
    setSelectedToken(token);
  };

  const handleDataFetch = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <MobileResponsiveMessage />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-24">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                <Brain className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                TradeSense
              </h1>
              <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                AI-Powered Trading Signals stored immutably on 0G Newton Testnet
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Zap className="w-4 h-4" />
                <span>Real-time AI Analysis</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Database className="w-4 h-4" />
                <span>0G Newton Testnet Storage</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Pyth Network Data</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        
        {/* Token Selection Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Step 1: Select Token</span>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Choose Your Trading Asset
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select from popular cryptocurrencies to analyze with our AI-powered trading signals
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <TokenSelector 
              onTokenSelect={handleTokenSelect}
              loading={isLoading}
            />
          </div>
        </section>
        
        {/* Price Analysis Section */}
        {selectedToken && (
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span>Step 2: Analyze & Generate</span>
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                AI Market Analysis
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get real-time price data from Pyth Network and generate intelligent trading signals
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <PythDataDisplay 
                selectedToken={selectedToken}
                onDataFetch={handleDataFetch}
              />
            </div>
          </section>
        )}

        {/* Signal History Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                <Database className="w-4 h-4" />
                <span>Step 3: View History</span>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Your Trading History
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              All your trading signals are stored permanently on 0G Newton Testnet for transparency and immutability
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-12 text-center">
              <div className="p-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <History className="w-12 h-12 text-purple-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Access Your Complete Trading History
              </h3>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                View all your AI-generated trading signals stored immutably on 0G Newton Testnet. 
                Connect your wallet to access your personalized trading history.
              </p>

              <button
                onClick={() => router.push('/history')}
                className="group bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                <Database className="w-6 h-6" />
                View Trading History
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Blockchain Stored</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Wallet Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>0G Network</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="text-center space-y-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Why Choose TradeSense?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">AI-Powered Analysis</h3>
                  <p className="text-gray-600">
                    Advanced machine learning algorithms analyze market data to provide intelligent trading signals with confidence scores.
                  </p>
                </div>
              </div>

              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Blockchain Storage</h3>
                  <p className="text-gray-600">
                    All trading signals are stored immutably on 0G Newton Testnet, ensuring transparency and permanent record keeping.
                  </p>
                </div>
              </div>

              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Real-time Data</h3>
                  <p className="text-gray-600">
                    Powered by Pyth Network's high-frequency price feeds for accurate and up-to-date market information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Orbit />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <Brain className="w-8 h-8" />
                <span className="text-2xl font-bold">TradeSense</span>
              </div>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Revolutionizing trading with AI-powered insights and blockchain transparency. 
              Built for the future of decentralized finance.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <span className="text-gray-500">Powered by 0G Newton Testnet</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">Pyth Network Integration</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">OpenRouter AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}