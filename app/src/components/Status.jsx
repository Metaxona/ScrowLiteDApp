import { Box, Card, Flex, Spinner, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber, Text, Tooltip } from "@chakra-ui/react";
import { FaInfoCircle } from "react-icons/fa";

export default function Status({
    label,
    value,
    helperText = null,
    arrowIncrease = null,
    padding = "1rem",
    width = "fit-content",
    minWidth = "100%",
    maxWidth = "fit-content",
    height = "fit-content",
    minHeight = "fit-content",
    maxHeight = "100%",
    help = "",
    isLoading = false,
    children,
}) {
    return (
        <Box>
            <Card p={padding} w={width} minW={minWidth} maxW={maxWidth} h={height} minH={minHeight} maxH={maxHeight}>
                <StatGroup>
                    <Stat>
                        <Flex flexDirection={"row"} alignItems={"center"} gap={"0.5rem"}>
                            {label && <StatLabel>{label}</StatLabel>}
                            {help && (
                                <Tooltip label={help} placement="auto">
                                    <Text>
                                        <FaInfoCircle />
                                    </Text>
                                </Tooltip>
                            )}
                        </Flex>
                        {isLoading ? <Spinner /> : value && <StatNumber>{value}</StatNumber>}
                        {helperText && (
                            <StatHelpText>
                                {arrowIncrease && <StatArrow type={arrowIncrease} />}
                                {helperText}
                            </StatHelpText>
                        )}
                    </Stat>
                    {children && children}
                </StatGroup>
            </Card>
        </Box>
    );
}
