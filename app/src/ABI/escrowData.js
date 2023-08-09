export const escrowData = {
    contractAddress: "0xB4B5a608908cb68cDBaDD620bb27E05080AF7931",
    abi: [
        {
            inputs: [
                {
                    internalType: "address",
                    name: "_escrowContract",
                    type: "address",
                },
            ],
            stateMutability: "nonpayable",
            type: "constructor",
        },
        { inputs: [], name: "NotOwnerError", type: "error" },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: "address",
                    name: "_newOwner",
                    type: "address",
                },
            ],
            name: "OwnershipTransfered",
            type: "event",
        },
        {
            inputs: [],
            name: "escrowContract",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{ internalType: "address", name: "_user", type: "address" }],
            name: "getExpandedHistory",
            outputs: [
                {
                    components: [
                        { internalType: "bool", name: "exist", type: "bool" },
                        {
                            internalType: "string",
                            name: "title",
                            type: "string",
                        },
                        {
                            internalType: "bytes32",
                            name: "id",
                            type: "bytes32",
                        },
                        {
                            internalType: "enum Status",
                            name: "status",
                            type: "uint8",
                        },
                        {
                            internalType: "address",
                            name: "partyA",
                            type: "address",
                        },
                        {
                            internalType: "address",
                            name: "partyB",
                            type: "address",
                        },
                        {
                            internalType: "enum AssetType",
                            name: "fromType",
                            type: "uint8",
                        },
                        {
                            internalType: "enum AssetType",
                            name: "toType",
                            type: "uint8",
                        },
                        {
                            components: [
                                {
                                    components: [
                                        {
                                            internalType: "address",
                                            name: "contractAddress",
                                            type: "address",
                                        },
                                        {
                                            internalType: "uint256",
                                            name: "amount",
                                            type: "uint256",
                                        },
                                    ],
                                    internalType: "struct ERC20Info",
                                    name: "erc20",
                                    type: "tuple",
                                },
                                {
                                    components: [
                                        {
                                            internalType: "address",
                                            name: "contractAddress",
                                            type: "address",
                                        },
                                        {
                                            internalType: "uint256",
                                            name: "tokenId",
                                            type: "uint256",
                                        },
                                    ],
                                    internalType: "struct ERC721Info",
                                    name: "erc721",
                                    type: "tuple",
                                },
                                {
                                    components: [
                                        {
                                            internalType: "address",
                                            name: "contractAddress",
                                            type: "address",
                                        },
                                        {
                                            internalType: "uint256",
                                            name: "tokenId",
                                            type: "uint256",
                                        },
                                        {
                                            internalType: "uint256",
                                            name: "amount",
                                            type: "uint256",
                                        },
                                    ],
                                    internalType: "struct ERC1155Info",
                                    name: "erc1155",
                                    type: "tuple",
                                },
                            ],
                            internalType: "struct Assets",
                            name: "from",
                            type: "tuple",
                        },
                        {
                            components: [
                                {
                                    components: [
                                        {
                                            internalType: "address",
                                            name: "contractAddress",
                                            type: "address",
                                        },
                                        {
                                            internalType: "uint256",
                                            name: "amount",
                                            type: "uint256",
                                        },
                                    ],
                                    internalType: "struct ERC20Info",
                                    name: "erc20",
                                    type: "tuple",
                                },
                                {
                                    components: [
                                        {
                                            internalType: "address",
                                            name: "contractAddress",
                                            type: "address",
                                        },
                                        {
                                            internalType: "uint256",
                                            name: "tokenId",
                                            type: "uint256",
                                        },
                                    ],
                                    internalType: "struct ERC721Info",
                                    name: "erc721",
                                    type: "tuple",
                                },
                                {
                                    components: [
                                        {
                                            internalType: "address",
                                            name: "contractAddress",
                                            type: "address",
                                        },
                                        {
                                            internalType: "uint256",
                                            name: "tokenId",
                                            type: "uint256",
                                        },
                                        {
                                            internalType: "uint256",
                                            name: "amount",
                                            type: "uint256",
                                        },
                                    ],
                                    internalType: "struct ERC1155Info",
                                    name: "erc1155",
                                    type: "tuple",
                                },
                            ],
                            internalType: "struct Assets",
                            name: "to",
                            type: "tuple",
                        },
                        {
                            internalType: "uint256",
                            name: "dateCreated",
                            type: "uint256",
                        },
                        {
                            internalType: "bool",
                            name: "isCompleted",
                            type: "bool",
                        },
                        {
                            internalType: "bool",
                            name: "isRejected",
                            type: "bool",
                        },
                        {
                            internalType: "bool",
                            name: "isCancelled",
                            type: "bool",
                        },
                    ],
                    internalType: "struct Instance[]",
                    name: "",
                    type: "tuple[]",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "owner",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "_newEscrow",
                    type: "address",
                },
            ],
            name: "setEscrowContractAddress",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
            name: "transferOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
    ],
};
