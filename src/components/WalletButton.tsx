import React from 'react';
import { useAccount } from 'wagmi';
import { web3modal } from '../lib/wagmi';
import { Wallet } from 'lucide-react';

export const WalletButton: React.FC = () => {
  const { address, isConnected } = useAccount();

  return (
    <button
      onClick={() => web3modal.open()}
      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
    >
      <Wallet size={20} />
      {isConnected ? (
        <span>
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
      ) : (
        <span>Connect Wallet</span>
      )}
    </button>
  );
};