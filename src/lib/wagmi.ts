import { createConfig, configureChains } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { createWeb3Modal } from '@web3modal/wagmi';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('WalletConnect Project ID is required. Please add it to your .env file.');
}

const { chains, publicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

export const config = createConfig({
  autoConnect: true,
  publicClient,
  chains
});

export const web3modal = createWeb3Modal({
  wagmiConfig: config,
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains,
  themeMode: 'light',
  themeVariables: {
    '--w3m-font-family': 'Inter, sans-serif',
    '--w3m-accent-color': '#2563eb'
  }
});