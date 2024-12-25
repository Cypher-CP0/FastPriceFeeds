import React from 'react';
import { Star } from 'lucide-react';

interface AssetInfoProps {
  name: string;
  symbol: string;
  image: string;
  isStarred: boolean;
  onStarToggle: (e: React.MouseEvent) => void;
}

export const AssetInfo: React.FC<AssetInfoProps> = ({
  name,
  symbol,
  image,
  isStarred,
  onStarToggle,
}) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onStarToggle}
        className={`p-1 rounded-full hover:bg-gray-700 ${
          isStarred ? 'text-yellow-400' : 'text-gray-500'
        }`}
      >
        <Star size={16} fill={isStarred ? 'currentColor' : 'none'} />
      </button>
      <img src={image} alt={name} className="w-6 h-6" />
      <div>
        <p className="font-medium text-white">{name}</p>
        <p className="text-sm text-gray-400 uppercase">{symbol}</p>
      </div>
    </div>
  );
};