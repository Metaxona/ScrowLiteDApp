import { Box, Flex, Hide, Text, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import { FaChartLine, FaPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const navColor = "#5CB9FE";
export function MobileNavigation() {
    const [activeTab, setActiveTab] = useState();

    return (
        <Hide above="lg">
            <Box bg={useColorModeValue("gray.200", "gray.700")} h={"3.5rem"} w={"100dvw"} p={"1rem"} position={"fixed"} bottom={0} zIndex={10}>
                <Flex flexDirection={"row"} gap={"1rem"} justifyContent={"space-evenly"}>
                    <NavLink to="/trades" style={({ isActive }) => (isActive ? { color: navColor } : {})}>
                        <FaChartLine style={{ margin: "auto" }} />
                        <Text fontSize={"x-small"}>Trades</Text>
                    </NavLink>
                    <NavLink to="/create" style={({ isActive }) => (isActive ? { color: navColor } : {})}>
                        <FaPlus style={{ margin: "auto" }} />
                        <Text fontSize={"x-small"}>Create</Text>
                    </NavLink>
                </Flex>
            </Box>
        </Hide>
    );
}

export function Navigation() {
    return (
        <Hide below="lg">
            <Box>
                <Flex flexDirection={"row"} gap={"1rem"} justifyContent={"space-evenly"}>
                    <NavLink to="/trades" style={({ isActive }) => (isActive ? { color: navColor } : {})}>
                        <Flex flexDirection={"row"} gap={"0.2rem"}>
                            <FaChartLine style={{ margin: "auto" }} />
                            <Text fontSize={"medium"}>Trades</Text>
                        </Flex>
                    </NavLink>
                    <NavLink to="/create" style={({ isActive }) => (isActive ? { color: navColor } : {})}>
                        <Flex flexDirection={"row"} gap={"0.2rem"}>
                            <FaPlus style={{ margin: "auto" }} />
                            <Text fontSize={"medium"}>Create</Text>
                        </Flex>
                    </NavLink>
                </Flex>
            </Box>
        </Hide>
    );
}
