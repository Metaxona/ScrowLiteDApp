import { createStandaloneToast } from "@chakra-ui/react";

export function errorToast(error) {
    const { ToastContainer, toast } = createStandaloneToast();

    toast({
        title: `${error.name}`,
        description: error?.cause ? `${error.cause}` : `${error.stack}`,
        status: "error",
        position: "top-right",
        isClosable: true,
        duration: 9000,
        containerStyle: {
            w: "90dvw",
            maxH: "20dvh",
            overflowY: "scroll",
        },
    });
}

export function successToast(successMessage, TxHash) {
    const { ToastContainer, toast } = createStandaloneToast();

    toast({
        title: `${successMessage}`,
        description: `Tx Hash: ${TxHash}`,
        status: "success",
        position: "top-right",
        isClosable: true,
        duration: 9000,
        containerStyle: {
            w: "90dvw",
            maxH: "20dvh",
            overflowY: "scroll",
        },
    });
}

export function successCopyToast(copiedText) {
    const { ToastContainer, toast } = createStandaloneToast();

    toast({
        title: `Successfuly Copied`,
        description: `${copiedText}`,
        status: "success",
        position: "top-right",
        isClosable: true,
        duration: 3000,
        containerStyle: {
            w: "90dvw",
            maxH: "20dvh",
            overflowY: "scroll",
        },
    });
}
