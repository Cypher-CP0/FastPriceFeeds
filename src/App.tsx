import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { WagmiConfig } from 'wagmi';
import { config } from './lib/wagmi';
import { fetchTopCryptos } from './services/api';
import { PriceCard } from './components/PriceCard';
import { SearchBar } from './components/SearchBar';
import { CryptoDetail } from './components/CryptoDetail';
import { ChatRoom } from './components/ChatRoom';
import { WalletButton } from './components/WalletButton';
import { useStarredAssets } from './hooks/useStarredAssets';
import { CryptoAsset } from './types/crypto';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const { starredIds, toggleStar, sortWithStarred } = useStarredAssets();
  
  const { data: cryptos, isLoading, error } = useQuery({
    queryKey: ['cryptos'],
    queryFn: fetchTopCryptos
  });

  const filteredCryptos = cryptos
    ? sortWithStarred(
        cryptos.filter(
          (crypto) =>
            crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <p className="text-red-500">Error loading cryptocurrency data</p>
      </div>
    );
  }

  return (
    <WagmiConfig config={config}>
      <div className="min-h-screen bg-dark-bg text-white">
        <nav className="bg-dark-surface border-b border-dark-border fixed top-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">FastPriceFeeds</h1>
              <div className="flex items-center gap-4">
                <div className="w-96">
                  <SearchBar value={searchTerm} onChange={setSearchTerm} />
                </div>
                <WalletButton />
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400">
                    <th className="py-3 px-4">Asset</th>
                    <th className="py-3 px-4 text-right">Price</th>
                    <th className="py-3 px-4">24h</th>
                    <th className="py-3 px-4">7d</th>
                    <th className="py-3 px-4">30d</th>
                    <th className="py-3 px-4">1y</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCryptos.map((crypto) => (
                    <tr
                      key={crypto.id}
                      onClick={() => setSelectedAsset(crypto)}
                      className="cursor-pointer hover:bg-dark-surface transition-colors"
                    >
                      <PriceCard
                        asset={crypto}
                        isStarred={starredIds.has(crypto.id)}
                        onStarToggle={() => toggleStar(crypto.id)}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <ChatRoom />

        {selectedAsset && (
          <CryptoDetail
            asset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
          />
        )}
      </div>
    </WagmiConfig>
  );
}

export default App;