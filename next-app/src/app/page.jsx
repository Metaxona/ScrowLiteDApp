"use client";
import { escrowInfo } from "@/ABI/escrow";
import ScrowLiteLogoBlackWF from "@/assets/ScrowLite_Black_WhiteFill.svg";
import ScrowLiteLogoWhiteBF from "@/assets/ScrowLite_White_BlackFill.svg";
import { InteractionControl } from "@/components/InteractionControl";
import Status from "@/components/Status";
import { Box, Flex, Heading, useColorMode } from "@chakra-ui/react";
import { readContracts } from "@wagmi/core";
import Image from "next/image";
import { useEffect, useState } from "react";

const ERC_TYPES = ["20", "721", "1155"];

export default function Home() {
    const { colorMode, toggleColorMode } = useColorMode();
    const [tradeCount, setTradeCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [cancelledCount, setCancelledCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
    const [interactionStatus, setInteractionStatus] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [ERC1, setERC1] = useState("20");
    const [ERC2, setERC2] = useState("20");

    useEffect(() => {
        let counter1 = 0;
        let counter2 = 0;

        const interval = setInterval(() => {
            setERC1(ERC_TYPES[counter1]);

            counter1++;
            if (counter1 === 3) {
                counter1 = 0;
            }
        }, 1000);

        const interval2 = setInterval(() => {
            setERC2(ERC_TYPES[counter2]);

            counter2++;
            if (counter2 === 3) {
                counter2 = 0;
            }
        }, 1000 / 3);

        return () => {
            clearInterval(interval);
            clearInterval(interval2);
        };
    }, []);

    useEffect(() => {
        setIsLoading(true);
        async function getStats() {
            const escrowContract = {
                address: escrowInfo.contractAddress,
                abi: escrowInfo.abi,
            };

            const data = await readContracts({
                contracts: [
                    {
                        ...escrowContract,
                        functionName: "tradeCount",
                    },
                    {
                        ...escrowContract,
                        functionName: "pendingCount",
                    },
                    {
                        ...escrowContract,
                        functionName: "completedCount",
                    },
                    {
                        ...escrowContract,
                        functionName: "cancelledCount",
                    },
                    {
                        ...escrowContract,
                        functionName: "rejectedCount",
                    },
                    {
                        ...escrowContract,
                        functionName: "interactionPaused",
                    },
                ],
            });
            const [trade, pending, completed, cancelled, rejected, interactionPaused] = data;

            setTradeCount(trade?.error ? "Error" : BigInt(trade.result).toString());
            setPendingCount(pending?.error ? "Error" : BigInt(pending.result).toString());
            setCompletedCount(completed?.error ? "Error" : BigInt(completed.result).toString());
            setCancelledCount(cancelled?.error ? "Error" : BigInt(cancelled.result).toString());
            setRejectedCount(rejected?.error ? "Error" : BigInt(rejected.result).toString());
            setInteractionStatus(interactionPaused?.error ? "Error" : interactionPaused.result);

            setIsLoading(false);
        }

        getStats();
    }, []);

    return (
        <Box w={"100dvw"}>
            <Flex flexDirection={"column"} gap={"1rem"} alignItems={"center"}>
                <Flex alignItems={"center"} my={"2rem"} flexDirection={"column"}>
                    {colorMode == "light" ? <Image draggable={false} src={ScrowLiteLogoWhiteBF} alt="ScrowLite" width={160} height={160} /> : <Image draggable={false} src={ScrowLiteLogoBlackWF} alt="ScrowLite" width={160} height={160} />}
                    <Heading size={"md"}>Trade</Heading>
                    <Heading size={"md"}>
                        ERC{ERC1} To ERC{ERC2}
                    </Heading>
                    <Heading size={"md"}>Without Worry</Heading>
                </Flex>

                <Flex justifyContent={"center"} my={"1rem"}>
                    <Status
                        isLoading={isLoading}
                        label={"Create/Accept Interaction"}
                        value={interactionStatus ? "Paused" : "Allowed"}
                        minWidth="10rem"
                        help="This shows the status of Create and Accept interactions, if they are enabled or not. Create and Accept interaction will only be paused if there is a security bug/exploit found in the contract"
                    />
                </Flex>

                <Flex flexWrap={"wrap"} justifyContent={"center"} gap={"1rem"}>
                    <Status isLoading={isLoading} label={"Total"} value={tradeCount} minWidth="10rem" />
                    <Status isLoading={isLoading} label={"Pending"} value={pendingCount} minWidth="10rem" />
                    <Status isLoading={isLoading} label={"Completed"} value={completedCount} minWidth="10rem" />
                    <Status isLoading={isLoading} label={"Cancelled"} value={cancelledCount} minWidth="10rem" />
                    <Status isLoading={isLoading} label={"Rejected"} value={rejectedCount} minWidth="10rem" />
                </Flex>

                <InteractionControl />
            </Flex>
        </Box>
    );
}
