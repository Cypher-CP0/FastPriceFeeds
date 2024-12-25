import React from 'react';

interface PriceInfoProps {
  currentPrice: number;
  marketCap: number;
}

export const PriceInfo: React.FC<PriceInfoProps> = ({ currentPrice, marketCap }) => {
  return (
    <div>
      <p className="text-white">${currentPrice.toLocaleString()}</p>
      <p className="text-sm text-gray-400">
        MCap: ${(marketCap / 1e9).toFixed(2)}B
      </p>
    </div>
  );
};