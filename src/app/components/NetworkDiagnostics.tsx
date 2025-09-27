'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, Loader2, Network, Settings } from 'lucide-react';

export default function NetworkDiagnostics() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);
    
    const logs: string[] = [];
    
    try {
      // Override console.log temporarily to capture logs
      const originalLog = console.log;
      const originalWarn = console.warn;
      const originalError = console.error;
      
      console.log = (...args) => {
        logs.push(`ℹ️ ${args.join(' ')}`);
        originalLog(...args);
      };
      
      console.warn = (...args) => {
        logs.push(`⚠️ ${args.join(' ')}`);
        originalWarn(...args);
      };
      
      console.error = (...args) => {
        logs.push(`❌ ${args.join(' ')}`);
        originalError(...args);
      };

      // Import and run diagnostics
      const { ContractService } = await import('@/lib/contractService');
      const contractService = new ContractService();
      await contractService.runNetworkDiagnostics();
      
      // Restore console methods
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      
      setResults(logs);
      
    } catch (error) {
      logs.push(`❌ Diagnostics failed: ${error}`);
      setResults(logs);
    } finally {
      setIsRunning(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-colors z-50"
        title="Network Diagnostics"
      >
        <Network className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-md w-80 max-h-96 overflow-hidden flex flex-col z-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-800">Network Diagnostics</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      
      <div className="mb-3">
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            <>
              <Settings className="w-4 h-4" />
              Run Network Test
            </>
          )}
        </button>
      </div>
      
      {results.length > 0 && (
        <div className="flex-1 overflow-y-auto bg-gray-50 rounded p-3 text-xs space-y-1">
          {results.map((result, index) => (
            <div key={index} className="font-mono">
              {result}
            </div>
          ))}
        </div>
      )}
      
      {results.length === 0 && !isRunning && (
        <div className="text-center text-gray-500 text-sm py-4">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>Run diagnostics to check your network connection and identify issues with the 0G testnet.</p>
        </div>
      )}
      
      {results.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Common Solutions:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Switch to 0G testnet in MetaMask</li>
              <li>Check internet connection</li>
              <li>Try refreshing the page</li>
              <li>Contact support if issues persist</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
