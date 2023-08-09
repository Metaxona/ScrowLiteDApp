"use client";
import { Link } from "@chakra-ui/next-js";
import { Box, Flex, Hide, Text, useColorModeValue } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { FaChartLine, FaPlus } from "react-icons/fa";

const navColor = "#5CB9FE";
export function MobileNavigation() {
    const pathName = usePathname();
    return (
        <Hide above="lg">
            <Box bg={useColorModeValue("gray.200", "gray.700")} h={"3.5rem"} w={"100dvw"} p={"1rem"} position={"fixed"} bottom={0} zIndex={10}>
                <Flex flexDirection={"row"} gap={"1rem"} justifyContent={"space-evenly"}>
                    <Link href="/trades" style={pathName === "/trades" ? { color: navColor } : {}}>
                        <FaChartLine style={{ margin: "auto" }} />
                        <Text fontSize={"x-small"}>Trades</Text>
                    </Link>
                    <Link href="/create" style={pathName === "/create" ? { color: navColor } : {}}>
                        <FaPlus style={{ margin: "auto" }} />
                        <Text fontSize={"x-small"}>Create</Text>
                    </Link>
                </Flex>
            </Box>
        </Hide>
    );
}

export function Navigation() {
    const pathName = usePathname();
    return (
        <Hide below="lg">
            <Box>
                <Flex flexDirection={"row"} gap={"1rem"} justifyContent={"space-evenly"}>
                    <Link href="/trades" style={pathName === "/trades" ? { color: navColor } : {}}>
                        <Flex flexDirection={"row"} gap={"0.2rem"}>
                            <FaChartLine style={{ margin: "auto" }} />
                            <Text fontSize={"medium"}>Trades</Text>
                        </Flex>
                    </Link>
                    <Link href="/create" style={pathName === "/create" ? { color: navColor } : {}}>
                        <Flex flexDirection={"row"} gap={"0.2rem"}>
                            <FaPlus style={{ margin: "auto" }} />
                            <Text fontSize={"medium"}>Create</Text>
                        </Flex>
                    </Link>
                </Flex>
            </Box>
        </Hide>
    );
}
