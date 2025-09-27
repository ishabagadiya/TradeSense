export interface Token {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  color: string;
}

export const tokens: Token[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '₿',
    price: 43250.50,
    change24h: 2.45,
    marketCap: 850000000000,
    volume24h: 25000000000,
    color: '#f7931a'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'Ξ',
    price: 2650.75,
    change24h: -1.23,
    marketCap: 320000000000,
    volume24h: 15000000000,
    color: '#627eea'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    icon: '◎',
    price: 98.45,
    change24h: 5.67,
    marketCap: 42000000000,
    volume24h: 3000000000,
    color: '#9945ff'
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    icon: '₳',
    price: 0.52,
    change24h: 3.21,
    marketCap: 18000000000,
    volume24h: 800000000,
    color: '#0033ad'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    icon: '⬟',
    price: 0.89,
    change24h: -2.15,
    marketCap: 8500000000,
    volume24h: 450000000,
    color: '#8247e5'
  },
  {
    id: 'chainlink',
    name: 'Chainlink',
    symbol: 'LINK',
    icon: '🔗',
    price: 14.25,
    change24h: 1.89,
    marketCap: 8000000000,
    volume24h: 600000000,
    color: '#2a5ada'
  }
];

export const formatPrice = (price: number): string => {
  if (price >= 1) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${price.toFixed(6)}`;
};

export const formatChange = (change: number): string => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
};

export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  }
  return `$${marketCap.toLocaleString()}`;
};
