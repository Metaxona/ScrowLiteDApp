import { Flex, Heading } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaWallet } from "react-icons/fa";
export default function PleaseConnect() {
    return (
        <ConnectButton
            label={
                <Flex gap={"1rem"} alignItems={"center"}>
                    <FaWallet />
                    <Heading size={"md"}>Connect Wallet</Heading>
                </Flex>
            }
        />
    );
}
