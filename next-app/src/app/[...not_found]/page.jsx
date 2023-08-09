"use client";
import { Flex, Text } from "@chakra-ui/react";

export default function NotFound() {
    return (
        <Flex justifyContent={"center"} alignItems={"center"} textAlign={"center"} w={"100dvw"}>
            <Text fontSize={"xx-large"}>404 | NOT FOUND</Text>
        </Flex>
    );
}
