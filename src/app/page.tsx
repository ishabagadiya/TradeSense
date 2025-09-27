"use client";

import { useState } from "react";
import MobileResponsiveMessage from "./components/MobileScreenPage";
import TokenSelector from "./components/TokenSelector";
import PythDataDisplay from "./components/PythDataDisplay";
import SignalHistory from "./components/SignalHistory";
import { Brain, Zap, Database, TrendingUp, Sparkles, ChevronRight } from "lucide-react";
import MainPage from "./components/MainPage";
import Image from "next/image";

export default function Home() {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTokenSelect = (token: string) => {
    setSelectedToken(token);
  };

  const handleDataFetch = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black max-w-7xl mx-auto">
      <MobileResponsiveMessage />
      
      {/* Hero Section */}
      <section className="relative bg-black text-white w-full h-[400px] overflow-hidden flex items-center justify-center mt-[100px]">
        {/* Background Grid Image */}
        <Image 
          src="/assets/bggrid.png" 
          alt="Background Grid" 
          width={100}
          height={300}
          className="absolute w-auto h-[600px] z-30 left-0 -top-10"
        />
        
        <div className="relative w-full px-4 h-full flex items-end justify-center z-10">
          <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden group text-center bg-checkered flex flex-col items-end justify-center">            
            <div className="relative z-10 space-y-8 flex flex-col items-end justify-center">
              {/* Main Content */}
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-8xl font-bold text-right bg-gradient-to-br from-green-300  to-white bg-clip-text text-transparent">
                  TradeSense
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  AI-powered trading signals with blockchain transparency
                </p>
              </div>

              {/* Key Features */}
              <div className="flex flex-wrap justify-end gap-6 text-xs">
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1.5 hover:bg-white/10 transition-all duration-300">
                  <Zap className="w-3 h-3 text-white" />
                  <span className="text-white font-medium">Real-time Analysis</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1.5 hover:bg-white/10 transition-all duration-300">
                  <Database className="w-3 h-3 text-white" />
                  <span className="text-white font-medium">0G Storage</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1.5 hover:bg-white/10 transition-all duration-300">
                  <TrendingUp className="w-3 h-3 text-white" />
                  <span className="text-white font-medium">Pyth Data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        
        <MainPage />
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
            <SignalHistory />
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
                    Powered by Pyth Network&apos;s high-frequency price feeds for accurate and up-to-date market information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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