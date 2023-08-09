"use client";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import { Badge, Box, Flex, Hide, IconButton, Text, Tooltip, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { FaWallet } from "react-icons/fa";
import { useAccount } from "wagmi";
import SLBWF from "../assets/ScrowLite_Black_WhiteFill.svg";
import SLWBF from "../assets/ScrowLite_White_BlackFill.svg";
import { Navigation } from "./Navigation";

function Header() {
    const { address, isConnected } = useAccount();
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <>
            <Box bg={useColorModeValue("gray.100", "gray.900")} px={4} position={"sticky"} top={0} zIndex={10}>
                <Flex h={16} padding={"0.5rem"} py={"1rem"} alignItems={"center"} justifyContent={"space-between"}>
                    <Link as={Link} href={"/"} _hover={{ color: "inherit" }}>
                        <Flex flexDirection={"row"} alignItems={"center"} gap={"0.2rem"}>
                            {colorMode == "light" ? (
                                <Box>
                                    <Image draggable={false} src={SLWBF} alt="ScrowLite" width={50} height={50} />
                                </Box>
                            ) : (
                                <Box>
                                    <Image draggable={false} src={SLBWF} alt="ScrowLite" width={50} height={50} />
                                </Box>
                            )}
                            <Hide below="md">
                                <Box>
                                    <Text fontWeight={"bold"} fontSize={"x-large"}>
                                        Scrow
                                    </Text>
                                </Box>
                            </Hide>
                            <Hide below="md">
                                <Box>
                                    <Text fontWeight={"bold"} fontSize={"x-large"} color={"#5CB9FE"}>
                                        Lite
                                    </Text>
                                </Box>
                            </Hide>
                            <Badge colorScheme="yellow">Testnet</Badge>
                        </Flex>
                    </Link>
                    <Navigation />
                    <Flex gap={"1rem"}>
                        <IconButton onClick={toggleColorMode} icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />} aria-label="Theme Mode" />
                        <Tooltip label={isConnected ? address : "Connect Wallet"}>
                            <Box>
                                <ConnectButton
                                    label={<FaWallet />}
                                    accountStatus={{
                                        smallScreen: "avatar",
                                        largeScreen: "full",
                                    }}
                                    showBalance={{
                                        smallScreen: false,
                                        largeScreen: true,
                                    }}
                                />
                            </Box>
                        </Tooltip>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
}

export default Header;
