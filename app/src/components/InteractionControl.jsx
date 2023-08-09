import { Badge, Button, Card, Flex, FormControl, FormLabel, Heading, Input } from "@chakra-ui/react";
import { readContracts, watchContractEvent, writeContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { escrowInfo } from "../ABI/escrow";
import { errorToast, successToast } from "../utils/toasts";
import { formatEther, parseEther } from "viem";

export function InteractionControl() {
    const { address, isConnected } = useAccount();
    const [interactionState, setInteractionState] = useState(false);
    const [contractOwner, setContractOwner] = useState();
    const [feeInETH, setFeeInETH] = useState();
    const [interactionStateChanged, setInteractionStateChanged] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);

    useEffect(() => {
        async function getInteractionState() {
            const data = await readContracts({
                contracts: [
                    {
                        address: escrowInfo.contractAddress,
                        abi: escrowInfo.abi,
                        functionName: "owner",
                    },
                    {
                        address: escrowInfo.contractAddress,
                        abi: escrowInfo.abi,
                        functionName: "interactionPaused",
                    },
                    {
                        address: escrowInfo.contractAddress,
                        abi: escrowInfo.abi,
                        functionName: "feeInETH",
                    },
                ],
            });

            const [_owner, _interactionPaused, _feeInETH] = data;

            setInteractionState(_interactionPaused.result);
            setContractOwner(_owner.result);
            setFeeInETH(_feeInETH.result);
        }

        getInteractionState();
    }, [interactionStateChanged]);

    async function changeInteractionState() {
        setInteractionStateChanged(true);
        setIsInteracting(true);
        try {
            const { hash } = await writeContract({
                address: escrowInfo.contractAddress,
                abi: escrowInfo.abi,
                functionName: "toggleCreateAndAccept",
            });

            const unwatch = watchContractEvent(
                {
                    address: escrowInfo.contractAddress,
                    abi: escrowInfo.abi,
                    eventName: "InteractionState",
                },
                (data) => {
                    setInteractionStateChanged(false);
                    successToast(`Successfully ${interactionState ? "Disabled" : "Enabled"} Accept And Create State`, hash);
                    unwatch();
                },
            );
        } catch (error) {
            errorToast(error);
            setIsInteracting(false);
        }
    }

    async function handleFeeChange(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        setIsInteracting(true);

        try {
            if (formJson.newFee === "" || formJson.newFee === null || formJson.newFee === undefined || parseFloat(formJson.newFee) <= 0) throw new Error("Invalid Fee Amount Error");

            const { hash } = await writeContract({
                address: escrowInfo.contractAddress,
                abi: escrowInfo.abi,
                functionName: "setFee",
                args: [parseEther(`${formJson.newFee}`)],
            });

            const unwatch = watchContractEvent(
                {
                    address: escrowInfo.contractAddress,
                    abi: escrowInfo.abi,
                    eventName: "FeeChanged",
                },
                (data) => {
                    setInteractionStateChanged(false);
                    setIsInteracting(false);
                    successToast(`Successfully Changed Fee To ${formatEther(`${formJson.newFee}`)} ETH`, hash);
                    unwatch();
                },
            );
        } catch (error) {
            errorToast(error);
            setIsInteracting(false);
        }
    }

    return (
        <>
            {isConnected && address === contractOwner && (
                <Card p={"1rem"} w={"19rem"} my={"5rem"}>
                    <Flex flexDirection={"column"} gap={"1rem"}>
                        <Flex flexDirection={"column"} gap={"1rem"}>
                            <Heading size={"md"}>
                                Interaction State:{" "}
                                <Badge colorScheme={interactionState ? "red" : "green"} p={"0.5rem"} borderRadius={"1rem"}>
                                    {interactionState ? "Disabled" : "Enabled"}
                                </Badge>
                            </Heading>
                            <Button isLoading={isInteracting} colorScheme={interactionState ? "green" : "red"} onClick={changeInteractionState}>
                                {interactionState ? "Enable" : "Pause"}
                            </Button>
                        </Flex>

                        <form onSubmit={handleFeeChange}>
                            <Flex flexDirection={"column"} gap={"1rem"}>
                                <Heading size={"md"}>
                                    Current Fee: <Badge p={"0.5rem"}>{formatEther(`${feeInETH}`)} ETH</Badge>
                                </Heading>
                                <FormControl>
                                    <FormLabel htmlFor="newFee">New Fee</FormLabel>
                                    <Input name="newFee" id="newFee" type="number" step={0.00001} />
                                </FormControl>
                                <Button isLoading={isInteracting} type="submit" colorScheme={"blue"}>
                                    Set Fee
                                </Button>
                            </Flex>
                        </form>
                    </Flex>
                </Card>
            )}
        </>
    );
}
