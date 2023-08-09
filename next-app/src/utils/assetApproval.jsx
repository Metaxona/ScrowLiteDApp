import { readContract, watchContractEvent, writeContract } from "@wagmi/core";
import { parseEther } from "viem";
import { erc20ABI, erc721ABI } from "wagmi";
import { erc1155Info } from "../ABI/erc1155";
import { ercbalance } from "../ABI/ercbalance";
import { escrowInfo } from "../ABI/escrow";

export async function approveERC20({ address, spender, amount, revokeApproval = false }, callback, errorCallback) {
    try {
        const acceptOrRevokeAmount = revokeApproval ? 0 : amount;

        const { hash } = await writeContract({
            address,
            abi: erc20ABI,
            functionName: "approve",
            args: [spender, acceptOrRevokeAmount],
        });

        const unwatch = watchContractEvent(
            {
                address,
                abi: erc20ABI,
                eventName: "Approval",
            },
            (data) => {
                callback(hash, data, unwatch);
            },
        );
    } catch (error) {
        errorCallback(error);
    }
}

export async function approveERC721({ address, approvalType = "ALL", operator, tokenId, revokeApproval = false }, callback, errorCallback) {
    try {
        if (approvalType === "SINGLE") {
            const { hash } = await writeContract({
                address,
                abi: erc721ABI,
                functionName: "approve",
                args: [operator, tokenId],
            });

            const unwatch = watchContractEvent(
                {
                    address,
                    abi: erc721ABI,
                    eventName: "Approval",
                },
                (data) => {
                    callback(hash, data, unwatch);
                },
            );
        }
        if (approvalType === "ALL") {
            const approveOrRevoke = !revokeApproval;

            const { hash } = await writeContract({
                address,
                abi: erc721ABI,
                functionName: "setApprovalForAll",
                args: [operator, approveOrRevoke],
            });

            const unwatch = watchContractEvent(
                {
                    address,
                    abi: erc721ABI,
                    eventName: "ApprovalForAll",
                },
                (data) => {
                    callback(hash, data, unwatch);
                },
            );
        }
    } catch (error) {
        errorCallback(error);
    }
}

export async function approveERC1155({ address, operator, revokeApproval = false }, callback, errorCallback) {
    try {
        const { hash } = await writeContract({
            address,
            abi: erc1155Info.abi,
            functionName: "setApprovalForAll",
            args: [operator, !revokeApproval],
        });

        const unwatch = watchContractEvent(
            {
                address,
                abi: erc1155Info.abi,
                eventName: "ApprovalForAll",
            },
            (data) => {
                callback(hash, data, unwatch);
            },
        );
    } catch (error) {
        errorCallback(error);
    }
}

export async function hasEnoughERCAllowance({ ercType, ownerAddress, tokenAddress, tokenId, tokenAmount }, callback, errorCallback) {
    try {
        let data;

        if (ercType === "ERC20") {
            data = await readContract({
                address: ercbalance.libraryAddress,
                abi: ercbalance.abi,
                functionName: `hasEnoughERC20Allowance`,
                args: [tokenAddress, ownerAddress, escrowInfo.contractAddress, parseEther(tokenAmount)],
            });
        }
        if (ercType === "ERC721") {
            data = await readContract({
                address: ercbalance.libraryAddress,
                abi: ercbalance.abi,
                functionName: `hasEnoughERC721Allowance`,
                args: [tokenAddress, escrowInfo.contractAddress, ownerAddress, tokenId],
            });
        }
        if (ercType === "ERC1155") {
            data = await readContract({
                address: ercbalance.libraryAddress,
                abi: ercbalance.abi,
                functionName: `hasEnoughERC1155Allowance`,
                args: [tokenAddress, escrowInfo.contractAddress, ownerAddress],
            });
        }
        callback(data);
    } catch (error) {
        errorCallback(error);
    }
}
