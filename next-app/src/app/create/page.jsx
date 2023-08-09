"use client";
import CreateTrade from "@/components/CreateTrade";
import PleaseConnect from "@/components/PleaseConnect";
import { Flex, Heading } from "@chakra-ui/react";
import { useAccount } from "wagmi";

export default function Create() {
    const { isConnected } = useAccount();
    return (
        <>
            {isConnected ? (
                <Flex flexDirection={"column"} maxW={"100dvw"} minH={"100dvh"}>
                    <Flex padding={"1rem"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} gap={"1rem"}>
                        <CreateTrade />
                    </Flex>
                </Flex>
            ) : (
                <Flex textAlign={"center"} alignItems={"center"} gap={"2rem"} flexDirection={"column"}>
                    <Heading>Please Connect Your Wallet</Heading>
                    <PleaseConnect />
                </Flex>
            )}
        </>
    );
}
