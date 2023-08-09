import { Flex } from "@chakra-ui/react";
import CreateTrade from "../components/CreateTrade";

export default function Create() {
    return (
        <Flex flexDirection={"column"} maxW={"100dvw"} minH={"100dvh"}>
            <Flex padding={"1rem"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} gap={"1rem"}>
                <CreateTrade />
            </Flex>
        </Flex>
    );
}
