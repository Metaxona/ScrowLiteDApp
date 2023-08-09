"use client";
import { Link } from "@chakra-ui/next-js";
import { Box, Flex, Heading, Hide, Text, useColorModeValue } from "@chakra-ui/react";
import { FaBug, FaDiscord, FaGithub } from "react-icons/fa";
export default function Footer() {
    return (
        <Hide below="lg">
            <Box bg={useColorModeValue("gray.100", "gray.900")} p={"1rem"} position={"absolute"} bottom={0} w={"100dvw"} h={"4rem"}>
                <Flex justifyContent={"space-between"}>
                    <Flex alignItems={"center"}>
                        <Heading size={"sm"}>Scorw</Heading>
                        <Heading size={"sm"}>Lite</Heading>
                    </Flex>
                    <Flex alignItems={"center"} gap={"0.2rem"}>
                        <Text>Metaxona</Text>
                        <Text>©</Text>
                        <Text>{new Date().getFullYear()}</Text>
                    </Flex>
                    <Flex gap={"1rem"} mr={"2rem"} alignItems={"center"}>
                        <Link href={"https://github.com/Metaxona/ScrowLite/issues"}>
                            <FaBug />
                        </Link>
                        <Link href={"https://github.com/Metaxona/ScrowLite"} target="_blank">
                            <FaGithub />
                        </Link>
                        {/* <Link href={"https://discord.com"} target='_blank'> */}
                        <FaDiscord />
                        {/* </Link> */}
                    </Flex>
                </Flex>
            </Box>
        </Hide>
    );
}
