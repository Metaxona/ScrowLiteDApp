import { Button, Flex, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { FaBug, FaDiscord, FaGithub, FaInfo } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function FloatingFooter() {
    const [showLinks, setShowLinks] = useState(false);

    return (
        <Flex position={"fixed"} right={"0.7rem"} bottom={"5rem"} gap={"0.5rem"} flexDirection={"column"}>
            {showLinks && (
                <Tooltip label={"Bug Report"} placement="left">
                    <Button p={0} as={Link} to={"https://github.com/Metaxona/ScrowLite/issues"} target="_blank" borderRadius={50} w={"1rem"} colorScheme="blue">
                        <FaBug ize={"5em"} />
                    </Button>
                </Tooltip>
            )}
            {showLinks && (
                <Tooltip label={"Github"} placement="left">
                    <Button p={0} as={Link} to={"https://github.com/Metaxona/ScrowLite"} target="_blank" borderRadius={50} w={"1rem"} colorScheme="blue">
                        <FaGithub />
                    </Button>
                </Tooltip>
            )}
            {showLinks && (
                <Tooltip label={"Discord"} placement="left">
                    <Button p={0} as={Link} to={"https://discord.com"} target="_blank" borderRadius={50} w={"1rem"} colorScheme="blue" pointerEvents={"none"}>
                        <FaDiscord />
                    </Button>
                </Tooltip>
            )}
            <Button p={0} onClick={() => setShowLinks((p) => !p)} borderRadius={50} w={"1rem"} colorScheme="blue">
                <FaInfo />
            </Button>
        </Flex>
    );
}
