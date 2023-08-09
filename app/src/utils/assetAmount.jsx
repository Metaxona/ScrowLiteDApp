import { formatEther, parseEther } from "viem";

export function parseAmountForERCAsset(assetType, amount) {
    if (assetType === "0" || assetType === "ERC20") return parseEther(amount);
    if (assetType === "1" || assetType === "ERC721") return 0;
    if (assetType === "2" || assetType === "ERC1155") return amount;
}

export function formatAmountForERCAsset(assetType, amount) {
    if (assetType === "0" || assetType === "ERC20") return formatEther(amount);
    if (assetType === "1" || assetType === "ERC721") return 0;
    if (assetType === "2" || assetType === "ERC1155") return amount;
}
