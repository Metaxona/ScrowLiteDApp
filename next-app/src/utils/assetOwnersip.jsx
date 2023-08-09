import { readContract } from "@wagmi/core";
import { ercbalance } from "../ABI/ercbalance";

export async function assetOwnership({ tokenType, tokenAddress, ownerAddress, tokenId, tokenAmount }, callback, errorCallback) {
    let assetInfo;

    try {
        if (tokenType === "ERC20") {
            assetInfo = await readContract({
                address: ercbalance.libraryAddress,
                abi: ercbalance.abi,
                functionName: "ownsERC20Amount",
                args: [tokenAddress, ownerAddress, tokenAmount],
            });
        }
        if (tokenType === "ERC721") {
            assetInfo = await readContract({
                address: ercbalance.libraryAddress,
                abi: ercbalance.abi,
                functionName: "ownsERC721token",
                args: [tokenAddress, ownerAddress, tokenId],
            });
        }
        if (tokenType === "ERC1155") {
            assetInfo = await readContract({
                address: ercbalance.libraryAddress,
                abi: ercbalance.abi,
                functionName: "ownsERC1155Amount",
                args: [tokenAddress, ownerAddress, tokenId, tokenAmount],
            });
        }

        callback(assetInfo);
    } catch (error) {
        errorCallback(error);
    }
}
