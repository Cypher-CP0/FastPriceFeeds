import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPriceHistory, fetchTransactions } from '../services/api';
import { CryptoAsset, Transaction } from '../types/crypto';
import { X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { createChart } from 'lightweight-charts';
import { format } from 'date-fns';

interface CryptoDetailProps {
  asset: CryptoAsset;
  onClose: () => void;
}

export const CryptoDetail: React.FC<CryptoDetailProps> = ({ asset, onClose }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [timeRange, setTimeRange] = useState(7);
  const { data: priceHistory, isLoading: isLoadingPrice } = useQuery({
    queryKey: ['priceHistory', asset.id, timeRange],
    queryFn: () => fetchPriceHistory(asset.id, timeRange)
  });

  const { data: transactions, isLoading: isLoadingTx } = useQuery({
    queryKey: ['transactions', asset.id],
    queryFn: () => fetchTransactions(asset.id),
    refetchInterval: 10000 // Refetch every 10 seconds
  });

  useEffect(() => {
    if (!chartContainerRef.current || !priceHistory) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1e293b' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#334155' },
        horzLines: { color: '#334155' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    candlestickSeries.setData(
      priceHistory.ohlc.map((candle) => ({
        time: candle.timestamp / 1000,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }))
    );

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [priceHistory]);

  const timeRanges = [
    { label: '24h', value: 1 },
    { label: '7d', value: 7 },
    { label: '30d', value: 30 },
    { label: '90d', value: 90 },
    { label: '1y', value: 365 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-dark-surface rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <img src={asset.image} alt={asset.name} className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold text-white">{asset.name}</h2>
              <p className="text-gray-400 uppercase">{asset.symbol}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-bg rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex gap-2 mb-4">
              {timeRanges.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setTimeRange(value)}
                  className={`px-4 py-2 rounded-lg ${
                    timeRange === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-dark-bg text-gray-300 hover:bg-dark-border'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {isLoadingPrice ? (
              <div className="h-[400px] flex items-center justify-center text-gray-400">
                <p>Loading chart...</p>
              </div>
            ) : (
              <div ref={chartContainerRef} className="h-[400px]" />
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {isLoadingTx ? (
                <p className="text-gray-400">Loading transactions...</p>
              ) : transactions?.map((tx) => (
                <div
                  key={tx.hash}
                  className="bg-dark-bg p-3 rounded-lg border border-dark-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {tx.type === 'buy' ? (
                        <ArrowUpRight className="text-green-500" size={20} />
                      ) : (
                        <ArrowDownRight className="text-red-500" size={20} />
                      )}
                      <span className="text-white font-medium">
                        {tx.type === 'buy' ? 'Buy' : 'Sell'}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {format(tx.timestamp, 'HH:mm:ss')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {tx.amount} {asset.symbol.toUpperCase()}
                    </span>
                    <span className="text-white">
                      ${tx.priceUsd.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 truncate">
                    {tx.hash}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};