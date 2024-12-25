import axios from 'axios';
import { CryptoAsset, PriceHistory, Transaction } from '../types/crypto';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Create an axios instance with rate limiting
const api = axios.create({
  baseURL: COINGECKO_API,
});

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

// Rate limiting queue
let lastRequestTime = 0;
const RATE_LIMIT_DELAY = 1100; // Ensure at least 1.1s between requests

const getRateLimitDelay = () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  const delay = Math.max(0, RATE_LIMIT_DELAY - timeSinceLastRequest);
  lastRequestTime = now + delay;
  return delay;
};

const fetchWithCache = async (url: string, params: any) => {
  const cacheKey = JSON.stringify({ url, params });
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Implement rate limiting
  const delay = getRateLimitDelay();
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  try {
    const response = await api.get(url, { params });
    cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 429) {
      // If rate limited, return cached data if available
      if (cached) return cached.data;
    }
    throw error;
  }
};

export const fetchTopCryptos = async (): Promise<CryptoAsset[]> => {
  const data = await fetchWithCache('/coins/markets', {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 100,
    page: 1,
    sparkline: false,
    price_change_percentage: '24h,7d,30d,365d'
  });

  return data.map((coin: any) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    current_price: coin.current_price,
    market_cap: coin.market_cap,
    total_volume: coin.total_volume,
    price_change_percentage_24h: coin.price_change_percentage_24h,
    price_change_percentage_7d: coin.price_change_percentage_7d_in_currency,
    price_change_percentage_30d: coin.price_change_percentage_30d_in_currency,
    price_change_percentage_1y: coin.price_change_percentage_365d_in_currency,
    image: coin.image
  }));
};

export const fetchPriceHistory = async (
  id: string,
  days: number = 7
): Promise<PriceHistory> => {
  const data = await fetchWithCache(`/coins/${id}/ohlc`, {
    vs_currency: 'usd',
    days: days
  });
  
  return {
    ohlc: data.map((candle: number[]) => ({
      timestamp: candle[0],
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4]
    }))
  };
};

// Simulated transaction data
export const fetchTransactions = async (id: string): Promise<Transaction[]> => {
  return Array.from({ length: 20 }, (_, i) => ({
    hash: `0x${Math.random().toString(16).slice(2)}`,
    type: Math.random() > 0.5 ? 'buy' : 'sell',
    amount: +(Math.random() * 10).toFixed(4),
    priceUsd: +(Math.random() * 50000).toFixed(2),
    timestamp: Date.now() - i * 60000
  }));
};