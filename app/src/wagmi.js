import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, sepolia } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

export const { chains, publicClient } = configureChains([sepolia], [alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY }), publicProvider()]);

const { connectors } = getDefaultWallets({
    appName: "WhitelistApp",
    projectId: "10572be452812a0d483a4ec33344be81",
    chains,
});

export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});
