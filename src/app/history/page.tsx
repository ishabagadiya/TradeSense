'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { 
  History, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Shield, 
  Clock, 
  BarChart3,
  Search,
  Database,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Wallet,
  AlertCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { contractService, StoredSignal } from '../../lib/contractService';
import { toast } from 'react-toastify';

export default function HistoryPage() {
  const router = useRouter();
  const { authenticated, login, user } = usePrivy();
  
  const [signals, setSignals] = useState<{ [token: string]: StoredSignal[] }>({});
  const [userTokens, setUserTokens] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'timestamp' | 'confidence' | 'token'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedSignals, setExpandedSignals] = useState<Set<string>>(new Set());
  const [networkConnected, setNetworkConnected] = useState(false);
  const [networkError, setNetworkError] = useState<string>('');

  useEffect(() => {
    if (authenticated && user) {
      checkNetworkAndLoadSignals();
    } else {
      setLoading(false);
    }
  }, [authenticated, user]);

  const checkNetworkAndLoadSignals = async () => {
    setLoading(true);
    setNetworkError('');
    
    try {
      // Check if connected to correct network
      const isCorrectNetwork = await contractService.isConnectedToCorrectNetwork();
      setNetworkConnected(isCorrectNetwork);
      
      if (isCorrectNetwork) {
        await loadUserSignals();
      } else {
        setNetworkError('Please switch to 0G Newton Testnet to view your trading history');
      }
    } catch (error) {
      console.error('Network check failed:', error);
      setNetworkError(error instanceof Error ? error.message : 'Failed to connect to 0G Newton Testnet');
      setNetworkConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const loadUserSignals = async () => {
    try {
      // Get all tokens user has signals for
      const tokens = await contractService.getMyTokens();
      setUserTokens(tokens);

      // Load signals for each token
      const allSignals: { [token: string]: StoredSignal[] } = {};
      
      for (const token of tokens) {
        const tokenSignals = await contractService.getMyTokenSignals(token);
        allSignals[token] = tokenSignals;
      }

      setSignals(allSignals);
      toast.success(`Loaded ${tokens.length} tokens with trading history from 0G Newton Testnet!`, {
        toastId: 'signals-loaded',
      });
    } catch (error) {
      console.error('Failed to load signals:', error);
      toast.error('Failed to load signal history from blockchain', {
        toastId: 'signals-load-error',
      });
      setNetworkError('Failed to load trading history. Please check your connection and try again.');
    }
  };

  const handleRefreshSignals = async () => {
    if (!authenticated) {
      toast.error('Please connect your wallet first', {
        toastId: 'wallet-connect-error',
      });
      return;
    }

    if (!networkConnected) {
      toast.error('Please switch to 0G Newton Testnet first', {
        toastId: 'network-error',
      });
      return;
    }

    setRefreshing(true);
    await checkNetworkAndLoadSignals();
    setRefreshing(false);
  };

  const getSignalIcon = (signalType: string) => {
    switch (signalType?.toLowerCase()) {
      case 'buy':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'sell':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'hold':
        return <Minus className="w-5 h-5 text-yellow-500" />;
      default:
        return <BarChart3 className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSignalColor = (signalType: string) => {
    switch (signalType?.toLowerCase()) {
      case 'buy':
        return 'bg-gradient-to-r from-green-400 to-green-600';
      case 'sell':
        return 'bg-gradient-to-r from-red-400 to-red-600';
      case 'hold':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  const formatPrice = (priceWei: bigint) => {
    const price = contractService.formatPriceFromWei(priceWei);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  };

  const formatDate = (timestamp: bigint) => {
    const date = contractService.formatTimestamp(timestamp);
    return date.toLocaleString();
  };

  const getFilteredAndSortedSignals = () => {
    let allSignalsArray: (StoredSignal & { tokenKey: string })[] = [];
    
    // Flatten all signals
    Object.entries(signals).forEach(([token, tokenSignals]) => {
      if (selectedToken === 'all' || selectedToken === token) {
        tokenSignals.forEach(signal => {
          allSignalsArray.push({ ...signal, tokenKey: token });
        });
      }
    });

    // Filter by search term
    if (searchTerm) {
      allSignalsArray = allSignalsArray.filter(signal =>
        signal.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signal.signal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signal.reasoning.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    allSignalsArray.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'timestamp':
          comparison = Number(a.timestamp) - Number(b.timestamp);
          break;
        case 'confidence':
          comparison = a.confidence - b.confidence;
          break;
        case 'token':
          comparison = a.tokenSymbol.localeCompare(b.tokenSymbol);
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return allSignalsArray;
  };

  const toggleSignalExpansion = (signalId: string) => {
    const newExpanded = new Set(expandedSignals);
    if (newExpanded.has(signalId)) {
      newExpanded.delete(signalId);
    } else {
      newExpanded.add(signalId);
    }
    setExpandedSignals(newExpanded);
  };

  const filteredSignals = getFilteredAndSortedSignals();
  const totalSignals = Object.values(signals).reduce((sum, tokenSignals) => sum + tokenSignals.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full shadow-lg mb-4">
            <Loader2 className="w-12 h-12 text-green-400 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading Trading History</h2>
          <p className="text-slate-400">Connecting to 0G Newton Testnet...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <button
            onClick={() => router.push('/')}
            className="mb-8 flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-12 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-purple-50/50 dark:from-green-900/10 dark:to-purple-900/10"></div>
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                                radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            ></div>
            
            <div className="relative z-10">
              <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Wallet className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                <span className="bg-gradient-to-br from-green-300 to-white bg-clip-text text-transparent">
                  Connect Your Wallet
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Connect your wallet to view your trading history stored on 0G Newton Testnet
              </p>
              <button
                onClick={login}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="mb-6 flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <span className="bg-gradient-to-br from-green-300 to-white bg-clip-text text-transparent">
                    Your Trading History
                  </span>
                  <Sparkles className="w-8 h-8 text-yellow-500" />
                </h1>
                <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2 text-xl font-medium">
                  <History className="w-4 h-4" />
                  Stored immutably on 0G Newton Testnet
                </p>
              </div>
            </div>
            
            <button
              onClick={handleRefreshSignals}
              disabled={refreshing || !networkConnected}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium shadow-lg hover:shadow-2xl"
            >
              {refreshing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  Refresh Signals
                </>
              )}
            </button>
          </div>
        </div>

        {/* Network Error */}
        {networkError && (
          <div className="mb-6 bg-red-900/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl flex items-center gap-3 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="font-medium">Network Connection Required</p>
              <p className="text-sm">{networkError}</p>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-purple-50/50 dark:from-green-900/10 dark:to-purple-900/10"></div>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
          {/* Stats Cards */}
          <div className="relative z-10 p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-4 rounded-xl border border-blue-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">Total Signals</span>
                </div>
                <div className="text-2xl font-bold text-blue-200">{totalSignals}</div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 p-4 rounded-xl border border-green-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-green-300">Buy Signals</span>
                </div>
                <div className="text-2xl font-bold text-green-200">
                  {filteredSignals.filter(s => s.signal.toLowerCase() === 'buy').length}
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 p-4 rounded-xl border border-red-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-medium text-red-300">Sell Signals</span>
                </div>
                <div className="text-2xl font-bold text-red-200">
                  {filteredSignals.filter(s => s.signal.toLowerCase() === 'sell').length}
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 p-4 rounded-xl border border-purple-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">Tokens</span>
                </div>
                <div className="text-2xl font-bold text-purple-200">{userTokens.length}</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="relative z-10 p-6 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search signals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Token Filter */}
              <select
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Tokens</option>
                {userTokens.map(token => (
                  <option key={token} value={token}>{token}</option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="timestamp">Sort by Date</option>
                <option value="confidence">Sort by Confidence</option>
                <option value="token">Sort by Token</option>
              </select>

              {/* Sort Order */}
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 flex items-center gap-2"
              >
                {sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              </button>
            </div>
          </div>

          {/* Signals List */}
          <div className="relative z-10 p-6">
            {filteredSignals.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-4 bg-slate-800/50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <History className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-200 mb-2">No Signals Found</h3>
                <p className="text-slate-400 mb-4">
                  {totalSignals === 0 
                    ? 'Generate your first AI trading signal to see it stored on the blockchain'
                    : 'No signals match your current filters'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSignals.map((signal, index) => {
                  const signalId = `${signal.tokenKey}-${Number(signal.timestamp)}-${index}`;
                  const isExpanded = expandedSignals.has(signalId);
                  
                  return (
                    <div
                      key={signalId}
                      className="bg-gradient-to-r from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-700/90 border border-slate-200 dark:border-slate-600 rounded-xl p-6 hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
                    >
                      {/* Signal Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`${getSignalColor(signal.signal)} p-3 rounded-lg text-white shadow-md`}>
                            {getSignalIcon(signal.signal)}
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                              {signal.signal.toUpperCase()} {signal.tokenSymbol}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatDate(signal.timestamp)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="w-4 h-4" />
                                {signal.confidence}% confidence
                              </span>
                              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                                {signal.signalTimeframe}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleSignalExpansion(signalId)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          {isExpanded ? <EyeOff className="w-5 h-5 text-slate-600 dark:text-slate-400" /> : <Eye className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
                        </button>
                      </div>

                      {/* Trading Levels - Always Visible */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-green-300">TP1</span>
                          </div>
                          <p className="text-lg font-bold text-green-200">{formatPrice(signal.tp1)}</p>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-green-300">TP2</span>
                          </div>
                          <p className="text-lg font-bold text-green-200">{formatPrice(signal.tp2)}</p>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <Shield className="w-4 h-4 text-red-400" />
                            <span className="text-sm font-medium text-red-300">Stop Loss</span>
                          </div>
                          <p className="text-lg font-bold text-red-200">{formatPrice(signal.sl)}</p>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-slate-200 dark:border-slate-600 pt-4 space-y-4">
                          <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl backdrop-blur-sm">
                            <h4 className="font-semibold text-green-300 mb-2 flex items-center gap-2">
                              <BarChart3 className="w-4 h-4" />
                              AI Reasoning
                            </h4>
                            <p className="text-green-200 leading-relaxed">{signal.reasoning}</p>
                          </div>

                          <div className="bg-slate-800/50 border border-slate-600 p-4 rounded-xl backdrop-blur-sm">
                            <h4 className="font-semibold text-slate-200 mb-3">Blockchain Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-slate-400">Stored on:</span>
                                <span className="font-medium ml-2 text-slate-200">0G Newton Testnet</span>
                              </div>
                              <div>
                                <span className="text-slate-400">Timestamp:</span>
                                <span className="font-medium ml-2 text-slate-200">{Number(signal.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
