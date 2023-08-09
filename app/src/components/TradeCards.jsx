import { ArrowDownIcon } from "@chakra-ui/icons";
import {
    Badge,
    Box,
    Button,
    Card,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Heading,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { watchContractEvent, writeContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { Link } from "react-router-dom";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { escrowInfo } from "../ABI/escrow";
import { alchemy } from "../alchemy/alchemy";
import ERC1155Image from "../assets/ERC1155.svg";
import ERC20Image from "../assets/ERC20.svg";
import ERC721Image from "../assets/ERC721.svg";
import { approveERC1155, approveERC20, approveERC721, hasEnoughERCAllowance } from "../utils/assetApproval";
import { assetOwnership } from "../utils/assetOwnersip";
import copyToClipboard from "../utils/copy";
import { IPFStoHTTP } from "../utils/ipfstohttps";
import shortenAddress from "../utils/shortenAddress";
import { errorToast, successToast } from "../utils/toasts";

const outlineColor = "#5CB9FE";
const ONE_DAY_IN_MILISECONDS = 86400000;
const SEPOLIA_ADDRESS_LINK = "https://sepolia.etherscan.io/address/";

const STATUS_BADGE_COLOR_SCHEME = {
    PENDING: "orange",
    COMPLETED: "green",
    CANCELLED: "red",
    REJECTED: "red",
};

const REMOVE_INTERACTIONS_ON = ["COMPLETED", "CANCELLED", "REJECTED"];

const ASSET_IMAGE = {
    ERC20: ERC20Image,
    ERC721: ERC721Image,
    ERC1155: ERC1155Image,
};

export default function TradeCard({ partyA, partyB, title, tradeId, status, fromType, fromAddress, fromTokenId, fromAmount, toType, toAddress, toTokenId, toAmount, dateCreated, setRefreshTrades }) {
    const [isInteracting, setIsInteracting] = useState(false);
    const { isOpen: drawerIsOpen, onOpen: drawerOnOpen, onClose: drawerOnClose } = useDisclosure();
    const {
        isOpen: modalIsOpen,
        onOpen: modalOnOpen,
        onClose: modalOnClose,
    } = useDisclosure({
        onOpen: () => setIsInteracting(true),
        onClose: () => setIsInteracting(false),
    });
    const { address, isConnected } = useAccount();
    const [fromImage, setFromImage] = useState(ASSET_IMAGE[fromType]);
    const [toImage, setToImage] = useState(ASSET_IMAGE[toType]);
    const [interactionType, setInteractionType] = useState();
    const [hasEnoughAllowance, setHasEnoughAllowance] = useState(false);
    const [hasBeenApproved, setHasBeenApproved] = useState(false);
    const [assetOwner, setAssetOwner] = useState(false);
    const [fromAssetInfo, setFromAssetInfo] = useState();
    const [toAssetInfo, setToAssetInfo] = useState();
    async function handleInteraction(_interactionType) {
        try {
            if (_interactionType === "Accept") {
                const { hash } = await writeContract({
                    address: escrowInfo.contractAddress,
                    abi: escrowInfo.abi,
                    functionName: "acceptTrade",
                    args: [tradeId],
                });

                const unwatch = watchContractEvent(
                    {
                        address: escrowInfo.contractAddress,
                        abi: escrowInfo.abi,
                        eventName: "Completed",
                    },
                    (data) => {
                        if (data[0].args.partyB === address) {
                            setIsInteracting(false);
                            successToast(`${tradeId} Successfuly Accepted`, hash);
                            setRefreshTrades((p) => !p);
                            unwatch();
                        }
                    },
                );
            }

            if (_interactionType === "Reject") {
                const { hash } = await writeContract({
                    address: escrowInfo.contractAddress,
                    abi: escrowInfo.abi,
                    functionName: "rejectTrade",
                    args: [tradeId],
                });

                const unwatch = watchContractEvent(
                    {
                        address: escrowInfo.contractAddress,
                        abi: escrowInfo.abi,
                        eventName: "Rejected",
                    },
                    (data) => {
                        if (data[0].args.partyB === address) {
                            setIsInteracting(false);
                            successToast(`${tradeId} Successfuly Rejected`, hash);
                            setRefreshTrades((p) => !p);
                            unwatch();
                        }
                    },
                );
            }

            if (_interactionType === "Cancel") {
                const { hash } = await writeContract({
                    address: escrowInfo.contractAddress,
                    abi: escrowInfo.abi,
                    functionName: "cancelTrade",
                    args: [tradeId],
                });

                const unwatch = watchContractEvent(
                    {
                        address: escrowInfo.contractAddress,
                        abi: escrowInfo.abi,
                        eventName: "Cancelled",
                    },
                    (data) => {
                        if (data[0].args.partyA === address) {
                            setIsInteracting(false);
                            successToast(`${tradeId} Successfuly Cancelled`, hash);
                            setRefreshTrades((p) => !p);
                            unwatch();
                        }
                    },
                );
            }
        } catch (error) {
            errorToast(error);
            setIsInteracting(false);
        }

        modalOnClose();
    }

    useEffect(() => {
        isConnected &&
            address === partyB &&
            assetOwnership(
                { tokenType: toType, tokenAddress: toAddress, ownerAddress: address, tokenAmount: toAmount, tokenId: toTokenId },
                (assetInfo) => {
                    setAssetOwner(assetInfo);
                },
                (error) => {
                    errorToast(error);
                },
            );

        isConnected &&
            address === partyA &&
            assetOwnership(
                { tokenType: fromType, tokenAddress: fromAddress, ownerAddress: address, tokenAmount: fromAmount, tokenId: fromTokenId },
                (assetInfo) => {
                    setAssetOwner(assetInfo);
                },
                (error) => {
                    errorToast(error);
                },
            );
    }, [address, tradeId, drawerIsOpen]);

    useEffect(() => {
        async function getMetadata() {
            if (fromType === "ERC20") {
                const fromMetadata = await alchemy.core.getTokenMetadata(fromAddress);
                setFromImage(fromMetadata.logo || ASSET_IMAGE[fromType]);
                setFromAssetInfo({
                    name: fromMetadata.name,
                    collectionName: null,
                    symbol: fromMetadata.symbol,
                });
            }
            if (fromType === "ERC721") {
                const fromMetadata = await alchemy.nft.getNftMetadata(fromAddress, fromTokenId, { tokenType: fromType });
                setFromImage(IPFStoHTTP(fromMetadata.rawMetadata?.image_url || fromMetadata.rawMetadata?.image || ASSET_IMAGE[fromType]));
                setFromAssetInfo({
                    name: fromMetadata?.title,
                    collectionName: fromMetadata.contract?.name,
                    symbol: fromMetadata.contract?.symbol,
                });
            }
            if (fromType === "ERC1155") {
                const fromMetadata = await alchemy.nft.getNftMetadata(fromAddress, fromTokenId, { tokenType: fromType });
                setFromImage(IPFStoHTTP(fromMetadata.rawMetadata?.image_url || fromMetadata.rawMetadata?.image || ASSET_IMAGE[fromType]));
                setFromAssetInfo({
                    name: fromMetadata?.title,
                    collectionName: fromMetadata.contract?.name,
                    symbol: null,
                });
            }
            if (toType === "ERC20") {
                const toMetadata = await alchemy.core.getTokenMetadata(toAddress);
                setToImage(toMetadata.logo || ASSET_IMAGE[toType]);
                setToAssetInfo({
                    name: toMetadata?.name,
                    collectionName: null,
                    symbol: toMetadata?.symbol,
                });
            }
            if (toType === "ERC721") {
                const toMetadata = await alchemy.nft.getNftMetadata(toAddress, toTokenId, { tokenType: toType });
                setToImage(IPFStoHTTP(toMetadata.rawMetadata?.image_url || toMetadata.rawMetadata?.image || ASSET_IMAGE[toType]));
                setToAssetInfo({
                    name: toMetadata?.title,
                    collectionName: toMetadata.contract?.name,
                    symbol: toMetadata.contract?.symbol,
                });
            }
            if (toType === "ERC1155") {
                const toMetadata = await alchemy.nft.getNftMetadata(toAddress, toTokenId, { tokenType: toType });
                setToImage(IPFStoHTTP(toMetadata.rawMetadata?.image_url || toMetadata.rawMetadata?.image || ASSET_IMAGE[toType]));
                setToAssetInfo({
                    name: toMetadata?.title,
                    collectionName: toMetadata.contract?.name,
                    symbol: null,
                });
            }
        }

        isConnected && getMetadata();
    }, [tradeId, status]);

    useEffect(() => {
        isConnected &&
            address === partyB &&
            !REMOVE_INTERACTIONS_ON.includes(status) &&
            hasEnoughERCAllowance(
                { ercType: toType, ownerAddress: partyB, tokenAddress: toAddress, tokenId: toTokenId, tokenAmount: toAmount },
                (data) => {
                    if (toType === "ERC721" && !assetOwner) return setHasEnoughAllowance(false);
                    setHasEnoughAllowance(data);
                },
                (error) => {
                    errorToast(error);
                },
            );
    }, [address, tradeId, hasBeenApproved]);

    async function approveAsset() {
        setIsInteracting(true);
        setHasBeenApproved(false);

        if (toType === "ERC20") {
            approveERC20(
                { address: toAddress, spender: escrowInfo.contractAddress, amount: parseEther(toAmount) },
                (hash, data, unwatch) => {
                    if (data[0].args.owner === address) {
                        setIsInteracting(false);
                        successToast(`${toAddress} Successfuly Approved`, hash);
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
        if (toType === "ERC721") {
            approveERC721(
                { address: toAddress, operator: escrowInfo.contractAddress, tokenId: toTokenId, approvalType: "SINGLE" },
                (hash, data, unwatch) => {
                    if (data[0].args.owner === address) {
                        setIsInteracting(false);
                        successToast(`${toAddress} Successfuly Approved`, hash);
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
        if (toType === "ERC1155") {
            approveERC1155(
                { address: toAddress, operator: escrowInfo.contractAddress },
                (hash, data, unwatch) => {
                    if (data[0].args.owner === address) {
                        setIsInteracting(false);
                        successToast(`${toAddress} Successfuly Approved`, hash);
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

    return (
        <>
            <Card as={"button"} padding={"0.7rem"} width={{ base: "11rem", md: "11rem", lg: "12rem" }} cursor={"pointer"} onClick={drawerOnOpen} _hover={{ outline: `3px solid ${outlineColor}` }}>
                <Heading size={"sm"} mb={"0.5rem"} noOfLines={2} h={"-webkit-fill-available"}>
                    {title}
                </Heading>
                <Flex maxW={"-webkit-fill-available"} flexDirection={"column"} gap={"0.3rem"}>
                    <Image aspectRatio={1} src={toImage} alt={toAddress} borderRadius={"0.5rem"} />
                    <Flex flexDirection={"row"} gap={"0.5rem"} flexWrap={"wrap"}>
                        <Badge w={"fit-content"} colorScheme="blue">
                            {toType}
                        </Badge>
                        {toTokenId && (
                            <Badge w={"fit-content"} colorScheme="green">
                                Id: {toTokenId}
                            </Badge>
                        )}
                        {toAmount && (
                            <Badge w={"fit-content"} colorScheme="gray">
                                <small>Amount</small> {toAmount}
                            </Badge>
                        )}
                        {toAssetInfo?.symbol ? <Badge w={"fit-content"}>{toAssetInfo.symbol}</Badge> : ""}
                        <Badge w={"fit-content"} colorScheme={STATUS_BADGE_COLOR_SCHEME[status]}>
                            {status}
                        </Badge>
                        {address === partyB && status === "PENDING" && (
                            <Badge w={"fit-content"} colorScheme={assetOwner ? "green" : "red"}>
                                {assetOwner ? "Owned" : "Not Owned"}
                            </Badge>
                        )}
                        {Date.now() - parseInt(BigInt(dateCreated).toString()) * 1000 <= ONE_DAY_IN_MILISECONDS && (
                            <Badge w={"fit-content"} colorScheme="red">
                                NEW!
                            </Badge>
                        )}
                    </Flex>
                    <Flex overflowX={"clip"} flexDirection={"column"} justifyContent={"start"} gap={"0.2rem"} textAlign={"start"}>
                        <Heading noOfLines={2} size={"medium"}>
                            {toAssetInfo?.name ? toAssetInfo?.name : toAssetInfo?.collectionName}
                        </Heading>
                        <Text fontSize={"small"}>{toAssetInfo?.collectionName}</Text>
                    </Flex>
                </Flex>
                <Flex fontSize={"xx-small"} mt={"0.3rem"} gap={"0.3rem"} alignItems={"center"}>
                    Trade Id: {shortenAddress(tradeId)}
                </Flex>
            </Card>

            <Drawer isOpen={drawerIsOpen} onClose={drawerOnClose} size={{ base: "sm", md: "md", lg: "lg" }}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>{title}</DrawerHeader>
                    <DrawerCloseButton />
                    <DrawerBody>
                        <Flex flexDirection={"column"} gap={"1rem"}>
                            <Flex gap={"0.5rem"} alignItems={"center"}>
                                Trade Id: {shortenAddress(tradeId)} <FaCopy onClick={() => copyToClipboard(tradeId)} cursor={"pointer"} />
                            </Flex>
                            <Text>Date Created: {new Date(parseInt(BigInt(dateCreated).toString()) * 1000).toLocaleDateString()}</Text>
                            <Flex flexDirection={"column"} alignItems={"start"} justifyContent={"space-evenly"} h={"100%"}>
                                <Flex gap={"0.5rem"} alignItems={"center"}>
                                    <Heading size={"sm"}>
                                        {partyA === address && (
                                            <>
                                                <Badge variant={"solid"} p={"0.5rem"} borderRadius={"1rem"} colorScheme="blue">
                                                    You
                                                </Badge>{" "}
                                            </>
                                        )}
                                        From:{" "}
                                        <Link to={`${SEPOLIA_ADDRESS_LINK}${partyA}`} target="_blank">
                                            {shortenAddress(partyA)}
                                        </Link>
                                    </Heading>{" "}
                                    <FaCopy onClick={() => copyToClipboard(partyA)} cursor={"pointer"} />
                                </Flex>
                                <Flex
                                    flexDirection={{
                                        base: "column",
                                        md: "column",
                                        lg: "row",
                                        xl: "row",
                                    }}
                                    gap={"1rem"}
                                    mt={"1rem"}
                                    maxW={"-webkit-fill-available"}
                                    overflowX={"clip"}
                                >
                                    <Image width={"10rem"} aspectRatio={1} src={fromImage} alt={fromAddress} borderRadius={"0.5rem"} />
                                    <Box>
                                        <Flex gap={"0.5rem"}>
                                            <Badge p={"0.2rem"} colorScheme="blue">
                                                {fromType}
                                            </Badge>
                                            {fromTokenId && <Badge p={"0.2rem"}>Id: {fromTokenId}</Badge>}
                                            {fromAmount && <Badge p={"0.2rem"}>Amount: {fromAmount}</Badge>}
                                            {address === partyA && status === "PENDING" && (
                                                <Badge p={"0.2rem"} colorScheme={assetOwner ? "green" : "red"}>
                                                    {assetOwner ? "Owned" : "Not Owned"}
                                                </Badge>
                                            )}
                                        </Flex>
                                        <Flex overflowX={"clip"} flexDirection={"column"}>
                                            <Heading noOfLines={2} size={"md"}>
                                                {fromAssetInfo?.name}
                                            </Heading>
                                            <Text noOfLines={2}>{fromAssetInfo?.collectionName}</Text>
                                            <Flex gap={"0.5rem"} alignItems={"center"}>
                                                <Link to={`${SEPOLIA_ADDRESS_LINK}${fromAddress}`} target="_blank">
                                                    {shortenAddress(fromAddress)}
                                                </Link>{" "}
                                                <FaCopy onClick={() => copyToClipboard(fromAddress)} cursor={"pointer"} />
                                            </Flex>
                                        </Flex>
                                    </Box>
                                </Flex>
                                <Flex w={100} my={"1rem"} justifyContent={"center"}>
                                    <ArrowDownIcon />
                                </Flex>
                                <Flex gap={"0.5rem"} alignItems={"center"}>
                                    <Heading size={"sm"}>
                                        {partyB === address && (
                                            <>
                                                <Badge variant={"solid"} p={"0.5rem"} borderRadius={"1rem"} colorScheme="blue">
                                                    You
                                                </Badge>{" "}
                                            </>
                                        )}
                                        To:{" "}
                                        <Link to={`${SEPOLIA_ADDRESS_LINK}${partyB}`} target="_blank">
                                            {shortenAddress(partyB)}
                                        </Link>
                                    </Heading>{" "}
                                    <FaCopy onClick={() => copyToClipboard(partyB)} cursor={"pointer"} />
                                </Flex>
                                <Flex
                                    flexDirection={{
                                        base: "column",
                                        md: "column",
                                        lg: "row",
                                        xl: "row",
                                    }}
                                    gap={"1rem"}
                                    mt={"1rem"}
                                    overflowX={"clip"}
                                    maxW={"-webkit-fill-available"}
                                >
                                    <Image width={"10rem"} aspectRatio={1} src={toImage} alt={toAddress} borderRadius={"0.5rem"} />
                                    <Box>
                                        <Flex gap={"0.5rem"}>
                                            <Badge p={"0.2rem"} colorScheme="blue">
                                                {toType}
                                            </Badge>
                                            {toTokenId && <Badge p={"0.2rem"}>Id: {toTokenId}</Badge>}
                                            {toAmount && <Badge p={"0.2rem"}>Amount: {toAmount}</Badge>}
                                            {address === partyB && status === "PENDING" && (
                                                <Badge p={"0.2rem"} colorScheme={assetOwner ? "green" : "red"}>
                                                    {assetOwner ? "Owned" : "Not Owned"}
                                                </Badge>
                                            )}
                                        </Flex>
                                        <Flex overflowX={"clip"} flexDirection={"column"}>
                                            <Heading noOfLines={2} size={"md"}>
                                                {toAssetInfo?.name}
                                            </Heading>
                                            <Text noOfLines={2}>{toAssetInfo?.collectionName}</Text>
                                            <Flex gap={"0.5rem"} alignItems={"center"}>
                                                <Link to={`${SEPOLIA_ADDRESS_LINK}${toAddress}`} target="_blank">
                                                    {shortenAddress(toAddress)}
                                                </Link>{" "}
                                                <FaCopy onClick={() => copyToClipboard(toAddress)} cursor={"pointer"} />
                                            </Flex>
                                        </Flex>
                                    </Box>
                                </Flex>
                            </Flex>
                        </Flex>
                    </DrawerBody>

                    <DrawerFooter gap={"1rem"}>
                        {assetOwner && !hasEnoughAllowance && !REMOVE_INTERACTIONS_ON.includes(status) && address === partyB && (
                            <Button isLoading={isInteracting} w={"fit-content"} colorScheme="blue" variant={"solid"} onClick={approveAsset}>
                                Approve
                            </Button>
                        )}
                        {assetOwner && hasEnoughAllowance && !REMOVE_INTERACTIONS_ON.includes(status) && address === partyB && (
                            <Button
                                isLoading={isInteracting}
                                onClick={() => {
                                    modalOnOpen();
                                    setInteractionType("Accept");
                                }}
                                colorScheme="blue"
                                variant="solid"
                            >
                                Accept
                            </Button>
                        )}
                        {!REMOVE_INTERACTIONS_ON.includes(status) && address === partyB && (
                            <Button
                                isLoading={isInteracting}
                                onClick={() => {
                                    modalOnOpen();
                                    setInteractionType("Reject");
                                }}
                                colorScheme="red"
                                variant="solid"
                            >
                                Reject
                            </Button>
                        )}
                        {!REMOVE_INTERACTIONS_ON.includes(status) && address === partyA && (
                            <Button
                                isLoading={isInteracting}
                                onClick={() => {
                                    modalOnOpen();
                                    setInteractionType("Cancel");
                                }}
                                colorScheme="red"
                                variant="solid"
                            >
                                Cancel
                            </Button>
                        )}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            <Modal isOpen={modalIsOpen} onClose={modalOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader mr={"1rem"}>Are You Sure You Want To Proceed?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Proceeding in the trade will automatically execute the trade and there is no turning back.</Text>
                        <Spacer my={"1rem"} />
                        <Text>In the case of one party not having the required asset/s for this trade, the trade request will revert automatically and will not proceed until both party has the required assets for the trade.</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Flex gap={"1rem"}>
                            <Button colorScheme={"blue"} onClick={() => handleInteraction(interactionType)}>
                                Yes
                            </Button>
                            <Button colorScheme={"red"} onClick={modalOnClose}>
                                No
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
