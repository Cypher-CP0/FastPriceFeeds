import React from 'react';
import { Star } from 'lucide-react';
import { CryptoAsset } from '../types/crypto';
import { formatPercentage } from '../utils/format';

interface PriceCardProps {
  asset: CryptoAsset;
  isStarred: boolean;
  onStarToggle: () => void;
}

export const PriceCard: React.FC<PriceCardProps> = ({
  asset,
  isStarred,
  onStarToggle,
}) => {
  return (
    <>
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStarToggle();
            }}
            className={`p-1 rounded-full hover:bg-gray-700 ${
              isStarred ? 'text-yellow-400' : 'text-gray-500'
            }`}
          >
            <Star size={16} fill={isStarred ? 'currentColor' : 'none'} />
          </button>
          <img src={asset.image} alt={asset.name} className="w-6 h-6" />
          <div>
            <p className="font-medium text-white">{asset.name}</p>
            <p className="text-sm text-gray-400 uppercase">{asset.symbol}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-right">
        <p className="text-white">${asset.current_price.toLocaleString()}</p>
        <p className="text-sm text-gray-400">
          MCap: ${(asset.market_cap / 1e9).toFixed(2)}B
        </p>
      </td>
      <td className="py-4 px-4">
        {formatPercentage(asset.price_change_percentage_24h)}
      </td>
      <td className="py-4 px-4">
        {formatPercentage(asset.price_change_percentage_7d)}
      </td>
      <td className="py-4 px-4">
        {formatPercentage(asset.price_change_percentage_30d)}
      </td>
      <td className="py-4 px-4">
        {formatPercentage(asset.price_change_percentage_1y)}
      </td>
    </>
  );
};