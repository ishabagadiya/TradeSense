'use client';

import { useState, useEffect } from 'react';
import { 
  History, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Shield, 
  Clock, 
  BarChart3,
  Filter,
  Search,
  Calendar,
  ExternalLink,
  Wallet,
  Database,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';
import { contractService, StoredSignal } from '../../lib/contractService';
import { toast } from 'react-toastify';

interface SignalHistoryProps {
  userAddress?: string;
}

export default function SignalHistory({ userAddress }: SignalHistoryProps) {
  const [signals, setSignals] = useState<{ [token: string]: StoredSignal[] }>({});
  const [userTokens, setUserTokens] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'timestamp' | 'confidence' | 'token'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedSignals, setExpandedSignals] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (userAddress) {
      loadUserSignals();
    }
  }, [userAddress]);

  const loadUserSignals = async () => {
    setLoading(true);
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
      toast.success(`Loaded signals for ${tokens.length} tokens from 0G Newton Testnet!`);
    } catch (error) {
      console.error('Failed to load signals:', error);
      toast.error('Failed to load signal history from blockchain');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl mx-auto border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
            <Database className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              Signal History
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </h2>
            <p className="text-gray-600 flex items-center gap-2">
              <History className="w-4 h-4" />
              Stored on 0G Newton Testnet
            </p>
          </div>
        </div>
        
        <button
          onClick={loadUserSignals}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Loading...
            </>
          ) : (
            <>
              <Database className="w-4 h-4" />
              Refresh Signals
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Total Signals</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{totalSignals}</div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Buy Signals</span>
          </div>
          <div className="text-2xl font-bold text-green-700">
            {filteredSignals.filter(s => s.signal.toLowerCase() === 'buy').length}
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">Sell Signals</span>
          </div>
          <div className="text-2xl font-bold text-red-700">
            {filteredSignals.filter(s => s.signal.toLowerCase() === 'sell').length}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Tokens</span>
          </div>
          <div className="text-2xl font-bold text-purple-700">{userTokens.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search signals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Token Filter */}
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="timestamp">Sort by Date</option>
            <option value="confidence">Sort by Confidence</option>
            <option value="token">Sort by Token</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            {sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>
      </div>

      {/* Signals List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <span className="text-gray-600 text-lg">Loading signals from 0G Newton Testnet...</span>
          </div>
        </div>
      ) : filteredSignals.length === 0 ? (
        <div className="text-center py-16">
          <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <History className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Signals Found</h3>
          <p className="text-gray-500 mb-4">
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
                className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200"
              >
                {/* Signal Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`${getSignalColor(signal.signal)} p-3 rounded-lg text-white shadow-md`}>
                      {getSignalIcon(signal.signal)}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {signal.signal.toUpperCase()} {signal.tokenSymbol}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(signal.timestamp)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {signal.confidence}% confidence
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {signal.signalTimeframe}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSignalExpansion(signalId)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {isExpanded ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Trading Levels - Always Visible */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">TP1</span>
                    </div>
                    <p className="text-lg font-bold text-green-700">{formatPrice(signal.tp1)}</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">TP2</span>
                    </div>
                    <p className="text-lg font-bold text-green-700">{formatPrice(signal.tp2)}</p>
                  </div>

                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Stop Loss</span>
                    </div>
                    <p className="text-lg font-bold text-red-700">{formatPrice(signal.sl)}</p>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        AI Reasoning
                      </h4>
                      <p className="text-blue-700 leading-relaxed">{signal.reasoning}</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-3">Blockchain Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Stored on:</span>
                          <span className="font-medium ml-2">0G Newton Testnet</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Timestamp:</span>
                          <span className="font-medium ml-2">{Number(signal.timestamp)}</span>
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
  );
}
