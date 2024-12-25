import { useState, useEffect } from 'react';
import { CryptoAsset } from '../types/crypto';

export const useStarredAssets = () => {
  const [starredIds, setStarredIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('starred-assets');
    return new Set(saved ? JSON.parse(saved) : []);
  });

  const toggleStar = (assetId: string) => {
    setStarredIds(prev => {
      const next = new Set(prev);
      if (next.has(assetId)) {
        next.delete(assetId);
      } else {
        next.add(assetId);
      }
      return next;
    });
  };

  const sortWithStarred = (assets: CryptoAsset[]) => {
    return [...assets].sort((a, b) => {
      const aStarred = starredIds.has(a.id);
      const bStarred = starredIds.has(b.id);
      if (aStarred === bStarred) return 0;
      return aStarred ? -1 : 1;
    });
  };

  useEffect(() => {
    localStorage.setItem('starred-assets', JSON.stringify([...starredIds]));
  }, [starredIds]);

  return { starredIds, toggleStar, sortWithStarred };
};