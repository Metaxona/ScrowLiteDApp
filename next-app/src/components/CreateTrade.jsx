"use client";
import { erc1155Info } from "@/ABI/erc1155";
import { escrowInfo } from "@/ABI/escrow";
import { parseAmountForERCAsset } from "@/utils/assetAmount";
import { hasEnoughERCAllowance } from "@/utils/assetApproval";
import { assetOwnership } from "@/utils/assetOwnersip";
import { errorToast, successToast } from "@/utils/toasts";
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, FormControl, FormLabel, Hide, Input, Select, Show, Text } from "@chakra-ui/react";
import { readContract, watchContractEvent, writeContract } from "@wagmi/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";
import { parseEther } from "viem";
import { erc20ABI, erc721ABI, useAccount } from "wagmi";
import AssetApproval from "./AssetApproval";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const ASSET_TYPE = {
    0: "ERC20",
    1: "ERC721",
    2: "ERC1155",
};

export default function CreateTrade() {
    const { address, isConnected } = useAccount();

    const [fromAssetType, setFromAssetType] = useState();
    const [toAssetType, setToAssetType] = useState();

    const [fromContract, setFromContract] = useState("");
    const [fromTokenId, setFromTokenId] = useState(0);
    const [fromAmount, setFromAmount] = useState(0);

    const [hasEnoughAllowance, setHasEnoughAllowance] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);

    const [assetIsOwned, setAssetIsOwned] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setIsInteracting(true);

        const form = event.target;
        const formData = new FormData(form);

        const formJson = Object.fromEntries(formData.entries());

        const partyAparams = fillAssetDetails(formJson.fromType, formJson.fromContractAddress, formJson.fromTokenId, formJson?.fromTokenAmount ? parseAmountForERCAsset(formJson.fromType, `${formJson.fromTokenAmount}`) : 0);
        const partyBparams = fillAssetDetails(formJson.toType, formJson.toContractAddress, formJson.toTokenId, formJson?.toTokenAmount ? parseAmountForERCAsset(formJson.toType, `${formJson.toTokenAmount}`) : 0);

        try {
            const SelfZeroError = new Error(`Can Not Request Trade To Self Or To ${ZERO_ADDRESS}`);
            SelfZeroError.name = "TradeTargetError";

            if (formJson.partyB.toLowerCase() === address.toLowerCase() || formJson.partyB === ZERO_ADDRESS) throw SelfZeroError;

            const fee = await readContract({
                address: escrowInfo.contractAddress,
                abi: escrowInfo.abi,
                functionName: "feeInETH",
            });

            const { hash } = await writeContract({
                address: escrowInfo.contractAddress,
                abi: escrowInfo.abi,
                functionName: "createTrade",
                args: [formJson.fromType, formJson.toType, formJson.title, formJson.partyB, partyAparams, partyBparams],
                value: fee,
            });

            const unwatch = watchContractEvent(
                {
                    address: escrowInfo.contractAddress,
                    abi: escrowInfo.abi,
                    eventName: "Created",
                },
                (data) => {
                    if (data[0].args.partyA === address) {
                        setIsInteracting(false);
                        successToast("Trade Successfuly Created", hash);
                        unwatch();
                    }
                },
            );
        } catch (error) {
            errorToast(error);
            setIsInteracting(false);
        }
    }

    function fillAssetDetails(assetType, address, tokenId, amount) {
        if (assetType === "0") {
            return [
                [address, amount],
                [ZERO_ADDRESS, 0],
                [ZERO_ADDRESS, 0, 0],
            ];
        }
        if (assetType === "1") {
            return [
                [ZERO_ADDRESS, 0],
                [address, tokenId],
                [ZERO_ADDRESS, 0, 0],
            ];
        }
        if (assetType === "2") {
            return [
                [ZERO_ADDRESS, 0],
                [ZERO_ADDRESS, 0],
                [address, tokenId, amount],
            ];
        }
    }

    useEffect(() => {
        isConnected &&
            assetOwnership(
                { tokenType: ASSET_TYPE[fromAssetType], tokenAddress: fromContract, ownerAddress: address, tokenId: fromTokenId, tokenAmount: fromAmount },
                (assetInfo) => {
                    setAssetIsOwned(assetInfo);
                },
                (error) => {
                    errorToast(error);
                },
            );

        hasEnoughERCAllowance(
            { ercType: ASSET_TYPE[fromAssetType], ownerAddress: address, tokenAddress: fromContract, tokenId: fromTokenId, tokenAmount: fromAmount },
            (data) => {
                if (ASSET_TYPE[fromAssetType] === "ERC721" && !assetIsOwned) return setHasEnoughAllowance(false);
                setHasEnoughAllowance(data);
            },
            (error) => {
                errorToast(error);
            },
        );
    }, [address, fromContract, fromAmount, fromTokenId, isInteracting]);

    async function approveAsset() {
        setIsInteracting(true);
        try {
            if (fromAssetType === "0") {
                const { hash } = await writeContract({
                    address: fromContract,
                    abi: erc20ABI,
                    functionName: "approve",
                    args: [escrowInfo.contractAddress, parseEther(fromAmount)],
                });

                const unwatch = watchContractEvent(
                    {
                        address: fromContract,
                        abi: erc20ABI,
                        eventName: "Approval",
                    },
                    (data) => {
                        if (data[0].args.owner === address) {
                            setIsInteracting(false);
                            successToast(`${fromContract} Successfuly Approved`, hash);
                            unwatch();
                        }
                    },
                );
            }
            if (fromAssetType === "1") {
                const { hash } = await writeContract({
                    address: fromContract,
                    abi: erc721ABI,
                    functionName: "setApprovalForAll",
                    args: [escrowInfo.contractAddress, true],
                });

                const unwatch = watchContractEvent(
                    {
                        address: fromContract,
                        abi: erc721ABI,
                        eventName: "ApprovalForAll",
                    },
                    (data) => {
                        if (data[0].args.owner === address) {
                            setIsInteracting(false);
                            successToast(`${fromContract} Successfuly Approved`, hash);
                            unwatch();
                        }
                    },
                );
            }
            if (fromAssetType === "2") {
                const { hash } = await writeContract({
                    address: fromContract,
                    abi: erc1155Info.abi,
                    functionName: "setApprovalForAll",
                    args: [escrowInfo.contractAddress, true],
                });

                const unwatch = watchContractEvent(
                    {
                        address: fromContract,
                        abi: erc1155Info.abi,
                        eventName: "ApprovalForAll",
                    },
                    (data) => {
                        if (data[0].args.owner === address) {
                            setIsInteracting(false);
                            successToast(`${fromContract} Successfuly Approved`, hash);
                            unwatch();
                        }
                    },
                );
            }
        } catch (error) {
            errorToast(error);
            setIsInteracting(false);
        }
    }

    return (
        <Box mt={"2rem"}>
            <form onSubmit={handleSubmit}>
                <Flex alignItems={"center"} flexDirection={"column"} gap={"3rem"}>
                    <Box>
                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input isRequired name={"title"} w={"17rem"} placeholder="Title" maxLength={32} defaultValue={"Trade Request!"} />
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl>
                            <FormLabel>Target Address</FormLabel>
                            <Input isRequired name={"partyB"} w={"17rem"} placeholder="Target Address" minLength={42} maxLength={42} />
                        </FormControl>
                    </Box>
                    <Flex
                        flexDirection={{
                            base: "column",
                            md: "column",
                            lg: "row",
                        }}
                        gap={"1rem"}
                    >
                        <Card>
                            <CardHeader>From</CardHeader>
                            <CardBody display={"flex"} gap={"1rem"} flexDirection={"column"}>
                                <FormControl>
                                    <FormLabel>Contract Address</FormLabel>
                                    <Input isRequired name={"fromContractAddress"} placeholder="Asset Contract Address" minLength={42} maxLength={42} onChange={(e) => setFromContract(e.target.value)} />
                                </FormControl>
                                <Select isRequired name={"fromType"} placeholder="Asset Type" onChange={(e) => setFromAssetType(e.target.value)}>
                                    <option value="0">ERC20</option>
                                    <option value="1">ERC721</option>
                                    <option value="2">ERC1155</option>
                                </Select>
                                {(fromAssetType === "1" || fromAssetType === "2") && (
                                    <FormControl>
                                        <FormLabel>Asset Id</FormLabel>
                                        <Input isRequired name={"fromTokenId"} placeholder="Asset Id" onChange={(e) => setFromTokenId(e.target.value)} />
                                    </FormControl>
                                )}
                                {(fromAssetType === "0" || fromAssetType === "2") && (
                                    <FormControl>
                                        <FormLabel>Amount</FormLabel>
                                        <Input isRequired name={"fromTokenAmount"} type="number" placeholder="Asset Amount" onChange={(e) => setFromAmount(e.target.value)} />
                                    </FormControl>
                                )}
                            </CardBody>
                            <CardFooter></CardFooter>
                        </Card>

                        <Hide below="lg">
                            <FaArrowRight style={{ margin: "auto" }} />
                        </Hide>
                        <Show below="lg">
                            <FaArrowDown style={{ margin: "auto" }} />
                        </Show>

                        <Card>
                            <CardHeader>To</CardHeader>
                            <CardBody display={"flex"} gap={"1rem"} flexDirection={"column"}>
                                <FormControl>
                                    <FormLabel>Contract Address</FormLabel>
                                    <Input isRequired name={"toContractAddress"} placeholder="Asset Contract Address" minLength={42} maxLength={42} />
                                </FormControl>
                                <Select isRequired name={"toType"} placeholder="Asset Type" onChange={(e) => setToAssetType(e.target.value)}>
                                    <option value="0">ERC20</option>
                                    <option value="1">ERC721</option>
                                    <option value="2">ERC1155</option>
                                </Select>
                                {(toAssetType === "1" || toAssetType === "2") && (
                                    <FormControl>
                                        <FormLabel>Asset Id</FormLabel>
                                        <Input isRequired name={"toTokenId"} placeholder="Asset Id" />
                                    </FormControl>
                                )}
                                {(toAssetType === "0" || toAssetType === "2") && (
                                    <FormControl>
                                        <FormLabel>Amount</FormLabel>
                                        <Input isRequired name={"toTokenAmount"} type="number" placeholder="Asset Amount" />
                                    </FormControl>
                                )}
                            </CardBody>
                            <CardFooter></CardFooter>
                        </Card>
                    </Flex>
                    {hasEnoughAllowance ? (
                        <Button isLoading={isInteracting} type="submit" w={"15rem"} colorScheme="blue" variant={"solid"} isDisabled={!assetIsOwned}>
                            {assetIsOwned ? "Create Trade" : "Asset Not Owned"}
                        </Button>
                    ) : (
                        <Button isLoading={isInteracting} w={"15rem"} colorScheme="blue" variant={"solid"} onClick={approveAsset} isDisabled={!assetIsOwned}>
                            {assetIsOwned ? "Approve" : "Asset Not Owned"}
                        </Button>
                    )}

                    <Text>
                        No Assets For Testing?{" "}
                        <Link href="https://solidity.metaxona.com" target="_blank">
                            Get Some Here
                        </Link>
                    </Text>
                </Flex>
            </form>

            <AssetApproval />
        </Box>
    );
}
