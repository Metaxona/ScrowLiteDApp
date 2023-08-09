"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";

import { RainbowKitProvider, darkTheme, getDefaultWallets, lightTheme } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { WagmiConfig, configureChains, createConfig, sepolia } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

export function Providers({ children }) {
    return (
        <CacheProvider>
            <ChakraProvider>{children}</ChakraProvider>
        </CacheProvider>
    );
}

const { chains, publicClient } = configureChains([sepolia], [alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY }), publicProvider()]);

const { connectors } = getDefaultWallets({
    appName: "WhitelistApp",
    projectId: "10572be452812a0d483a4ec33344be81",
    chains,
});

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});

export function WalletProviders({ children }) {
    const [isMounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains} initialChain={sepolia} theme={{ lightMode: lightTheme(), darkMode: darkTheme() }}>
                {isMounted && children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
