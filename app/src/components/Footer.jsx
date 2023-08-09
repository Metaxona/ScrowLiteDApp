import { Box, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { FaDiscord, FaGithub, FaBug } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function Footer() {
    return (
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
                    <Link to={"https://github.com/Metaxona/ScrowLite/issues"}>
                        <FaBug />
                    </Link>
                    <Link to={"https://github.com/Metaxona/ScrowLite"} target="_blank">
                        <FaGithub />
                    </Link>
                    {/* <Link to={"https://discord.com"} target='_blank'> */}
                    <FaDiscord />
                    {/* </Link> */}
                </Flex>
            </Flex>
        </Box>
    );
}
