"use client";
import { escrowData } from "@/ABI/escrowData";
import AssetApproval from "@/components/AssetApproval";
import PleaseConnect from "@/components/PleaseConnect";
import TradeCard from "@/components/TradeCards";
import { formatAmountForERCAsset } from "@/utils/assetAmount";
import { Button, Flex, Heading, Select, Spacer, Spinner, Text, Tooltip } from "@chakra-ui/react";
import { readContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { FaRotateLeft } from "react-icons/fa6";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

const STATUS = {
    0: "PENDING",
    1: "COMPLETED",
    2: "CANCELLED",
    3: "REJECTED",
};

const ASSET_TYPE = {
    0: "ERC20",
    1: "ERC721",
    2: "ERC1155",
};

function sortByTimestamp(order = "Latest") {
    return function (x, y) {
        if (order === "Latest") return parseInt(BigInt(y.dateCreated).toString()) - parseInt(BigInt(x.dateCreated).toString());
        if (order === "Oldest") return parseInt(BigInt(x.dateCreated).toString()) - parseInt(BigInt(y.dateCreated).toString());
    };
}

/**
 * ["All", "You", "Others"]
 */
function filterByCreator(from = "All", address) {
    if (from === "All")
        return function (item) {
            return item;
        };
    if (from === "You")
        return function (item) {
            if (item.partyA === address) return item;
        };
    if (from === "Others")
        return function (item) {
            if (item.partyA !== address) return item;
        };
}

export default function TradesPage() {
    BigInt.prototype.toJSON = function () {
        return this.toString();
    };

    const { address, isConnected } = useAccount();
    const [pendingTrades, setPendingtrades] = useState([]);
    const [completedTrades, setCompletedtrades] = useState([]);
    const [cancelledTrades, setCancelledtrades] = useState([]);
    const [rejectedTrades, setRejectedtrades] = useState([]);

    const [showAllPending, setShowAllPending] = useState(false);
    const [showAllCompleted, setShowAllCompleted] = useState(false);
    const [showAllCancelled, setShowAllCancelled] = useState(false);
    const [showAllRejected, setShowAllRejected] = useState(false);
    const [refreshTrades, setRefreshTrades] = useState(false);

    const [filterOrder, setFilterOrder] = useState("Latest");
    const [filterFrom, setFilterFrom] = useState("All");

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        async function getHistory() {
            const trades = await readContract({
                address: escrowData.contractAddress,
                abi: escrowData.abi,
                functionName: "getExpandedHistory",
                args: [address],
            });

            setPendingtrades(structuredClone(trades).filter((trds) => trds.status === 0));
            setCompletedtrades(structuredClone(trades).filter((trds) => trds.status === 1));
            setCancelledtrades(structuredClone(trades).filter((trds) => trds.status === 2));
            setRejectedtrades(structuredClone(trades).filter((trds) => trds.status === 3));

            setIsLoading(false);
        }

        isConnected && getHistory();
    }, [address, refreshTrades]);

    let PendingVisibility = showAllPending ? pendingTrades.sort(sortByTimestamp(filterOrder)) : pendingTrades.sort(sortByTimestamp(filterOrder)).slice(0, 5);
    let CompletedVisibility = showAllCompleted ? completedTrades.sort(sortByTimestamp(filterOrder)) : completedTrades.sort(sortByTimestamp(filterOrder)).slice(0, 5);
    let CancelledVisibility = showAllCancelled ? cancelledTrades.sort(sortByTimestamp(filterOrder)) : cancelledTrades.sort(sortByTimestamp(filterOrder)).slice(0, 5);
    let RejectedVisibility = showAllRejected ? rejectedTrades.sort(sortByTimestamp(filterOrder)) : rejectedTrades.sort(sortByTimestamp(filterOrder)).slice(0, 5);

    PendingVisibility = PendingVisibility.filter(filterByCreator(filterFrom, address));
    CompletedVisibility = CompletedVisibility.filter(filterByCreator(filterFrom, address));
    CancelledVisibility = CancelledVisibility.filter(filterByCreator(filterFrom, address));
    RejectedVisibility = RejectedVisibility.filter(filterByCreator(filterFrom, address));

    return (
        <>
            {isConnected ? (
                <>
                    <Flex alignItems={"center"} gap={"0.5rem"} my={"1rem"}>
                        <Text>Filter</Text>
                        <FaFilter />
                        <Select id="tradeFilter" name="tradeFilter" w={"7rem"} onChange={(e) => setFilterOrder(e.target.value)}>
                            <option value="Latest">Latest</option>
                            <option value="Oldest">Oldest</option>
                        </Select>
                        <Select id="fromFilter" name="fromFilter" w={"7rem"} onChange={(e) => setFilterFrom(e.target.value)}>
                            <option value="All">All</option>
                            <option value="You">You</option>
                            <option value="Others">Others</option>
                        </Select>
                        <Tooltip label="Refresh Trades">
                            <Button variant="outline" borderColor="transparent" onClick={() => setRefreshTrades((p) => !p)}>
                                {" "}
                                <FaRotateLeft />
                            </Button>
                        </Tooltip>
                    </Flex>
                    <Flex justifyContent={"space-between"} flexDirection={"row"}>
                        <Heading size={"md"}>Pending ({pendingTrades.length})</Heading>

                        <Button onClick={() => setShowAllPending((p) => !p)}>{showAllPending ? "Hide" : "Show All"}</Button>
                    </Flex>

                    <Flex justifyContent={{ base: "center", md: "center", lg: "start", xl: "start" }} my={"1rem"} gap={"1rem"} flexWrap={"wrap"} flexDirection={"row"}>
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            PendingVisibility.map((item) => (
                                <TradeCard
                                    key={item.id}
                                    partyA={item.partyA}
                                    partyB={item.partyB}
                                    title={item.title}
                                    tradeId={item.id}
                                    status={STATUS[item.status]}
                                    fromType={ASSET_TYPE[item.fromType]}
                                    fromAddress={item.from[ASSET_TYPE[item.fromType].toLowerCase()].contractAddress}
                                    fromTokenId={
                                        item.from[ASSET_TYPE[item.fromType].toLowerCase()]?.tokenId || item.from[ASSET_TYPE[item.fromType].toLowerCase()].tokenId === BigInt(0n)
                                            ? BigInt(item.from[ASSET_TYPE[item.fromType].toLowerCase()].tokenId).toString()
                                            : ""
                                    }
                                    fromAmount={item.from[ASSET_TYPE[item.fromType].toLowerCase()]?.amount ? formatAmountForERCAsset(ASSET_TYPE[item.fromType], BigInt(item.from[ASSET_TYPE[item.fromType].toLowerCase()].amount).toString()) : ""}
                                    toType={ASSET_TYPE[item.toType]}
                                    toAddress={item.to[ASSET_TYPE[item.toType].toLowerCase()].contractAddress}
                                    toTokenId={
                                        item.to[ASSET_TYPE[item.toType].toLowerCase()]?.tokenId || item.to[ASSET_TYPE[item.toType].toLowerCase()].tokenId === BigInt(0n) ? BigInt(item.to[ASSET_TYPE[item.toType].toLowerCase()].tokenId).toString() : ""
                                    }
                                    toAmount={item.to[ASSET_TYPE[item.toType].toLowerCase()]?.amount ? formatAmountForERCAsset(ASSET_TYPE[item.toType], BigInt(item.to[ASSET_TYPE[item.toType].toLowerCase()].amount).toString()) : ""}
                                    dateCreated={item.dateCreated}
                                    setRefreshTrades={setRefreshTrades}
                                />
                            ))
                        )}
                    </Flex>

                    <Flex justifyContent={"space-between"} flexDirection={"row"}>
                        <Heading size={"md"}>Completed ({completedTrades.length})</Heading>

                        <Button onClick={() => setShowAllCompleted((p) => !p)}>{showAllCompleted ? "Hide" : "Show All"}</Button>
                    </Flex>

                    <Flex justifyContent={{ base: "center", md: "center", lg: "start", xl: "start" }} my={"1rem"} gap={"1rem"} flexWrap={"wrap"} flexDirection={"row"}>
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            CompletedVisibility.map((item) => (
                                <TradeCard
                                    key={item.id}
                                    partyA={item.partyA}
                                    partyB={item.partyB}
                                    title={item.title}
                                    tradeId={item.id}
                                    status={STATUS[item.status]}
                                    fromType={ASSET_TYPE[item.fromType]}
                                    fromAddress={item.from[ASSET_TYPE[item.fromType].toLowerCase()].contractAddress}
                                    fromTokenId={item.from[ASSET_TYPE[item.fromType].toLowerCase()]?.tokenId ? BigInt(item.from[ASSET_TYPE[item.fromType].toLowerCase()].tokenId).toString() : ""}
                                    fromAmount={item.from[ASSET_TYPE[item.fromType].toLowerCase()]?.amount ? formatEther(BigInt(item.from[ASSET_TYPE[item.fromType].toLowerCase()].amount).toString()) : ""}
                                    toType={ASSET_TYPE[item.toType]}
                                    toAddress={item.to[ASSET_TYPE[item.toType].toLowerCase()].contractAddress}
                                    toTokenId={item.to[ASSET_TYPE[item.toType].toLowerCase()]?.tokenId ? BigInt(item.to[ASSET_TYPE[item.toType].toLowerCase()].tokenId).toString() : ""}
                                    toAmount={item.to[ASSET_TYPE[item.toType].toLowerCase()]?.amount ? formatEther(BigInt(item.to[ASSET_TYPE[item.toType].toLowerCase()].amount).toString()) : ""}
                                    dateCreated={item.dateCreated}
                                    setRefreshTrades={setRefreshTrades}
                                />
                            ))
                        )}
                    </Flex>

                    <Flex justifyContent={"space-between"} flexDirection={"row"}>
                        <Heading size={"md"}>Cancelled ({cancelledTrades.length})</Heading>

                        <Button onClick={() => setShowAllCancelled((p) => !p)}>{showAllCancelled ? "Hide" : "Show All"}</Button>
                    </Flex>

                    <Flex justifyContent={{ base: "center", md: "center", lg: "start", xl: "start" }} my={"1rem"} gap={"1rem"} flexWrap={"wrap"} flexDirection={"row"}>
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            CancelledVisibility.map((item) => (
                                <TradeCard
                                    key={item.id}
                                    partyA={item.partyA}
                                    partyB={item.partyB}
                                    title={item.title}
                                    tradeId={item.id}
                                    status={STATUS[item.status]}
                                    fromType={ASSET_TYPE[item.fromType]}
                                    fromAddress={item.from[ASSET_TYPE[item.fromType].toLowerCase()].contractAddress}
                                    fromTokenId={item.from[ASSET_TYPE[item.fromType].toLowerCase()]?.tokenId ? BigInt(item.from[ASSET_TYPE[item.fromType].toLowerCase()].tokenId).toString() : ""}
                                    fromAmount={item.from[ASSET_TYPE[item.fromType].toLowerCase()]?.amount ? formatEther(BigInt(item.from[ASSET_TYPE[item.fromType].toLowerCase()].amount).toString()) : ""}
                                    toType={ASSET_TYPE[item.toType]}
                                    toAddress={item.to[ASSET_TYPE[item.toType].toLowerCase()].contractAddress}
                                    toTokenId={item.to[ASSET_TYPE[item.toType].toLowerCase()]?.tokenId ? BigInt(item.to[ASSET_TYPE[item.toType].toLowerCase()].tokenId).toString() : ""}
                                    toAmount={item.to[ASSET_TYPE[item.toType].toLowerCase()]?.amount ? formatEther(BigInt(item.to[ASSET_TYPE[item.toType].toLowerCase()].amount).toString()) : ""}
                                    dateCreated={item.dateCreated}
                                    setRefreshTrades={setRefreshTrades}
                                />
                            ))
                        )}
                    </Flex>

                    <Flex justifyContent={"space-between"} flexDirection={"row"}>
                        <Heading size={"md"}>Rejected ({rejectedTrades.length})</Heading>

                        <Button onClick={() => setShowAllRejected((p) => !p)}>{showAllRejected ? "Hide" : "Show All"}</Button>
                    </Flex>

                    <Flex justifyContent={{ base: "center", md: "center", lg: "start", xl: "start" }} my={"1rem"} gap={"1rem"} flexWrap={"wrap"} flexDirection={"row"}>
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            RejectedVisibility.map((item) => (
                                <TradeCard
                                    key={item.id}
                                    partyA={item.partyA}
                                    partyB={item.partyB}
                                    title={item.title}
                                    tradeId={item.id}
                                    status={STATUS[item.status]}
                                    fromType={ASSET_TYPE[item.fromType]}
                                    fromAddress={item.from[ASSET_TYPE[item.fromType].toLowerCase()].contractAddress}
                                    fromTokenId={item.from[ASSET_TYPE[item.fromType].toLowerCase()]?.tokenId ? BigInt(item.from[ASSET_TYPE[item.fromType].toLowerCase()].tokenId).toString() : ""}
                                    fromAmount={item.from[ASSET_TYPE[item.fromType].toLowerCase()]?.amount ? formatEther(BigInt(item.from[ASSET_TYPE[item.fromType].toLowerCase()].amount).toString()) : ""}
                                    toType={ASSET_TYPE[item.toType]}
                                    toAddress={item.to[ASSET_TYPE[item.toType].toLowerCase()].contractAddress}
                                    toTokenId={item.to[ASSET_TYPE[item.toType].toLowerCase()]?.tokenId ? BigInt(item.to[ASSET_TYPE[item.toType].toLowerCase()].tokenId).toString() : ""}
                                    toAmount={item.to[ASSET_TYPE[item.toType].toLowerCase()]?.amount ? formatEther(BigInt(item.to[ASSET_TYPE[item.toType].toLowerCase()].amount).toString()) : ""}
                                    dateCreated={item.dateCreated}
                                    setRefreshTrades={setRefreshTrades}
                                />
                            ))
                        )}
                    </Flex>
                    <Spacer my={"5rem"} />
                    <AssetApproval />
                </>
            ) : (
                <Flex textAlign={"center"} alignItems={"center"} gap={"2rem"} flexDirection={"column"}>
                    <Heading>Please Connect Your Wallet</Heading>
                    <PleaseConnect />
                </Flex>
            )}
        </>
    );
}
