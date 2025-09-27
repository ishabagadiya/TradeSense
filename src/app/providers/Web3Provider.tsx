"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PrivyClientConfig } from "@privy-io/react-auth";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { http } from "viem";
import { defineChain } from "viem";

interface Web3ProviderProps {
  children: React.ReactNode;
  autoConnect?: boolean;
}

// Define 0G Testnet chain
const zeroGTestnet = defineChain({
  id: 16602,
  name: '0G Newton Testnet',
  nativeCurrency: {
    decimals: 18,
    name: '0G',
    symbol: '0G',
  },
  rpcUrls: {
    default: { http: ['https://evmrpc-testnet.0g.ai'] },
  },
  blockExplorers: {
    default: { 
      name: '0G Newton Testnet Explorer', 
      url: 'https://chainscan-galileo.0g.ai' 
    },
  },
  testnet: true,
});

// Wagmi configuration - Only 0G Testnet
const wagmiConfig = createConfig({
  chains: [zeroGTestnet],
  transports: {
    [zeroGTestnet.id]: http('https://evmrpc-testnet.0g.ai'),
  },
});

// Privy configuration - Only 0G Testnet
const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: true,
    noPromptOnSignature: false,
  },
  loginMethods: ["wallet", "google", "farcaster", "discord", "github", "email"],
  appearance: {
    showWalletLoginFirst: true,
    logo: "",
    theme: 'light',
    accentColor: '#3B82F6',
  },
  defaultChain: zeroGTestnet,
  supportedChains: [zeroGTestnet],
};

const queryClient = new QueryClient();

export default function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={privyConfig}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
