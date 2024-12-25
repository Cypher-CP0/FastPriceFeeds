import React from 'react';
import { CryptoAsset } from '../../types/crypto';
import { formatPercentage } from '../../utils/format';
import { AssetInfo } from './AssetInfo';
import { PriceInfo } from './PriceInfo';

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
  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStarToggle();
  };

  return (
    <>
      <td className="py-4 px-4">
        <AssetInfo
          name={asset.name}
          symbol={asset.symbol}
          image={asset.image}
          isStarred={isStarred}
          onStarToggle={handleStarClick}
        />
      </td>
      <td className="py-4 px-4 text-right">
        <PriceInfo
          currentPrice={asset.current_price}
          marketCap={asset.market_cap}
        />
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