"use client"
import MainPage from "./components/MainPage";
import TokenSelector from "./components/TokenSelector";
import PythDataDisplay from "./components/PythDataDisplay";
import { useState } from "react";

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
    <div className="min-h-screen w-full flex flex-col">
      {/* Main content container with padding to avoid navbar overlap */}
      <main className="flex-grow flex items-center justify-center pt-24 pb-20 px-4">
        <div className="w-full max-w-7xl mx-auto">
          <MainPage />

          <div className="w-full max-w-6xl px-4 mb-8">
          <TokenSelector 
            onTokenSelect={handleTokenSelect}
            loading={isLoading}
          />
        </div>
        
        {/* Pyth Network Price Display Section */}
        <div className="w-full max-w-6xl px-4">
          <PythDataDisplay 
            selectedToken={selectedToken}
            onDataFetch={handleDataFetch}
          />
        </div>
        </div>
      </main>
    </div>
  );
}