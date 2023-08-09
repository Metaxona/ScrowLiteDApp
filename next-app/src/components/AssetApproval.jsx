"use client";
import { Button, Card, Flex, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { escrowInfo } from "@/ABI/escrow";
import { approveERC1155, approveERC20, approveERC721 } from "@/utils/assetApproval";
import { errorToast } from "@/utils/toasts";

export default function AssetApproval() {
    const [isInteracting, setIsInteracting] = useState(false);
    const [assetType, setAssetType] = useState("ERC20");
    const [interactionType, setInteractionType] = useState();

    async function handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        setIsInteracting(true);

        if (interactionType === "Approve") {
            if (assetType === "ERC20") {
                approveERC20(
                    { address: formJson.approvalContractAddress, spender: escrowInfo.contractAddress, amount: parseEther(`${formJson.approvalAmount}`) },
                    (hash, data, unwatch) => {
                        if (data[0].args.owner === address) {
                            setIsInteracting(false);
                            successToast(`${formJson.approvalContractAddress} Successfuly Approved ${formatEther(`${formJson.approvalAmount}`)} Tokens`, hash);
                            unwatch();
                        }
                    },
                    (error) => {
                        errorToast(error);
                        setIsInteracting(false);
                    },
                );
            }
            if (assetType === "ERC721") {
                approveERC721(
                    { address: formJson.approvalContractAddress, operator: escrowInfo.contractAddress, tokenId: formJson.approvalTokenId, approvalType: "SINGLE" },
                    (hash, data, unwatch) => {
                        if (data[0].args.owner === address) {
                            setIsInteracting(false);
                            successToast(`${formJson.approvalContractAddress} Successfuly Approved Id: ${formJson.approvalTokenId}`, hash);
                            setHasBeenApproved(true);
                            unwatch();
                        }
                    },
                    (error) => {
                        errorToast(error);
                        setIsInteracting(false);
                    },
                );
            }

            if (interactionType === "ApproveAll") {
                if (assetType === "ERC721") {
                    approveERC721(
                        { address: formJson.approvalContractAddress, operator: escrowInfo.contractAddress, approvalType: "ALL" },
                        (hash, data, unwatch) => {
                            if (data[0].args.owner === address) {
                                setIsInteracting(false);
                                successToast(`${formJson.approvalContractAddress} Successfuly Approved Id: ${formJson.approvalTokenId}`, hash);
                                setHasBeenApproved(true);
                                unwatch();
                            }
                        },
                        (error) => {
                            errorToast(error);
                            setIsInteracting(false);
                        },
                    );
                }
                if (assetType === "ERC1155") {
                    approveERC1155(
                        { address: formJson.approvalContractAddress, operator: escrowInfo.contractAddress, tokenId: formJson.approvalTokenId },
                        (hash, data, unwatch) => {
                            if (data[0].args.owner === address) {
                                setIsInteracting(false);
                                successToast(`${formJson.approvalContractAddress} Successfuly Approved Id: ${formJson.approvalTokenId}`, hash);
                                setHasBeenApproved(true);
                                unwatch();
                            }
                        },
                        (error) => {
                            errorToast(error);
                            setIsInteracting(false);
                        },
                    );
                }
            }
        }

        if (interactionType === "Revoke") {
            if (assetType === "ERC20") {
                approveERC20(
                    { address: formJson.approvalContractAddress, spender: escrowInfo.contractAddress, amount: parseEther(`${formJson.approvalAmount}`), revokeApproval: true },
                    (hash, data, unwatch) => {
                        if (data[0].args.owner === address) {
                            setIsInteracting(false);
                            successToast(`${formJson.approvalContractAddress} Successfuly Approved ${formatEther(`${formJson.approvalAmount}`)} Tokens`, hash);
                            unwatch();
                        }
                    },
                    (error) => {
                        errorToast(error);
                        setIsInteracting(false);
                    },
                );
            }
            if (assetType === "ERC721") {
                approveERC721(
                    { address: formJson.approvalContractAddress, operator: escrowInfo.contractAddress, approvalType: "ALL", revokeApproval: true },
                    (hash, data, unwatch) => {
                        if (data[0].args.owner === address) {
                            setIsInteracting(false);
                            successToast(`${formJson.approvalContractAddress} Successfuly Approved Id: ${formJson.approvalTokenId}`, hash);
                            setHasBeenApproved(true);
                            unwatch();
                        }
                    },
                    (error) => {
                        errorToast(error);
                        setIsInteracting(false);
                    },
                );
            }
            if (assetType === "ERC1155") {
                approveERC1155(
                    { address: formJson.approvalContractAddress, operator: escrowInfo.contractAddress, tokenId: formJson.approvalTokenId, revokeApproval: true },
                    (hash, data, unwatch) => {
                        if (data[0].args.owner === address) {
                            setIsInteracting(false);
                            successToast(`${formJson.approvalContractAddress} Successfuly Approved Id: ${formJson.approvalTokenId}`, hash);
                            setHasBeenApproved(true);
                            unwatch();
                        }
                    },
                    (error) => {
                        errorToast(error);
                        setIsInteracting(false);
                    },
                );
            }
        }
    }

    return (
        <Card p={"1rem"} my={"1rem"}>
            <form onSubmit={handleSubmit}>
                <FormControl as={Flex} flexDirection={"column"} alignItems={"center"} gap={"1rem"}>
                    <FormLabel as={"legend"}>Approve And Revoke Asset Access</FormLabel>
                    <Flex flexDirection={"row"} flexWrap={"wrap"} justifyContent={"center"} gap={"1rem"}>
                        <Flex flexDirection={"column"}>
                            <FormLabel htmlFor={"approvalAssetType"}>Type</FormLabel>
                            <Select w={"7rem"} id="approvalAssetType" name={"approvalAssetType"} onChange={(e) => setAssetType(e.target.value)}>
                                <option value="ERC20">ERC20</option>
                                <option value="ERC721">ERC721</option>
                                <option value="ERC1155">ERC1155</option>
                            </Select>
                        </Flex>
                        <Flex flexDirection={"column"}>
                            <FormLabel htmlFor={"approvalContractAddress"}>ERC Address</FormLabel>
                            <Input w={"15rem"} id={"approvalContractAddress"} name="approvalContractAddress" minLength={42} maxLength={42} />
                        </Flex>
                        {assetType === "ERC721" && (
                            <Flex flexDirection={"column"}>
                                <FormLabel htmlFor={"approvalTokenId"}>Token Id</FormLabel>
                                <Input w={"7rem"} id={"approvalTokenId"} name="approvalTokenId" type="number" min={0} />
                            </Flex>
                        )}
                        {assetType === "ERC20" && (
                            <Flex flexDirection={"column"}>
                                <FormLabel htmlFor={"approvalAmount"}>Amount</FormLabel>
                                <Input w={"7rem"} id={"approvalAmount"} name="approvalAmount" type="number" min={0} />
                            </Flex>
                        )}
                    </Flex>
                    <Flex gap={"1rem"}>
                        {(assetType === "ERC20" || assetType === "ERC721") && (
                            <Button
                                isLoading={isInteracting}
                                type="submit"
                                colorScheme="blue"
                                onClick={() => {
                                    setInteractionType("Approve");
                                }}
                            >
                                Approve
                            </Button>
                        )}
                        {(assetType === "ERC721" || assetType === "ERC1155") && (
                            <Button
                                isLoading={isInteracting}
                                type="submit"
                                colorScheme="blue"
                                onClick={() => {
                                    setInteractionType("ApproveAll");
                                }}
                            >
                                Approve All
                            </Button>
                        )}
                        <Button
                            isLoading={isInteracting}
                            type="submit"
                            colorScheme="red"
                            onClick={() => {
                                setInteractionType("Revoke");
                            }}
                        >
                            Revoke
                        </Button>
                    </Flex>
                </FormControl>
            </form>
        </Card>
    );
}
