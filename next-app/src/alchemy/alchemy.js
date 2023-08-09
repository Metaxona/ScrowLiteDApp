"use client";
import { Alchemy, Network } from "alchemy-sdk";

const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

export { alchemy };
