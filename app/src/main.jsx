import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { WagmiConfig, sepolia } from "wagmi";
import App from "./App.jsx";
import "./index.css";
import { chains, wagmiConfig } from "./wagmi.js";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains} initialChain={sepolia} theme={{ lightMode: lightTheme(), darkMode: darkTheme() }}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </RainbowKitProvider>
        </WagmiConfig>
    </React.StrictMode>,
);
