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
    icon: '/img/btc.png',
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
    icon: '/img/eth.png',
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
    icon: '/img/solana.png',
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
    icon: '/img/cardano.png',
    price: 0.52,
    change24h: 3.21,
    marketCap: 18000000000,
    volume24h: 800000000,
    color: '#0033ad'
  },
  {
    id: 'bnb',
    name: 'BNB',
    symbol: 'BNB',
    icon: '/img/bnb.png',
    price: 320.45,
    change24h: 1.87,
    marketCap: 48000000000,
    volume24h: 1200000000,
    color: '#f3ba2f'
  },
  {
    id: 'tron',
    name: 'Tron',
    symbol: 'TRX',
    icon: '/img/tron.png',
    price: 0.12,
    change24h: 2.15,
    marketCap: 10500000000,
    volume24h: 450000000,
    color: '#ff0013'
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    icon: '/img/avalanche.png',
    price: 35.20,
    change24h: 4.12,
    marketCap: 12000000000,
    volume24h: 800000000,
    color: '#e84142'
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    icon: '/img/polkadot.png',
    price: 6.78,
    change24h: 2.34,
    marketCap: 7500000000,
    volume24h: 400000000,
    color: '#e6007a'
  },
  {
    id: 'bitget-token',
    name: 'Bitget Token',
    symbol: 'BGB',
    icon: '/img/bitget_token.png',
    price: 0.85,
    change24h: 3.45,
    marketCap: 1200000000,
    volume24h: 85000000,
    color: '#00FFFF'
  },
  {
    id: 'ton-coin',
    name: 'Ton Coin',
    symbol: 'TON',
    icon: '/img/ton-coin.png',
    price: 2.15,
    change24h: 5.67,
    marketCap: 7200000000,
    volume24h: 280000000,
    color: '#0098EA'
  },
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
