export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d: number | null;
  price_change_percentage_30d: number | null;
  price_change_percentage_1y: number | null;
  image: string;
}

export interface PriceHistory {
  ohlc: {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
}

export interface Transaction {
  hash: string;
  type: 'buy' | 'sell';
  amount: number;
  priceUsd: number;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  address: string;
  message: string;
  timestamp: number;
}