export const escrowInfo = {
    contractAddress: "0x61caFF3872f505D3D0a4F40E156235D506816E49",
    abi: [
        { inputs: [], stateMutability: "nonpayable", type: "constructor" },
        { inputs: [], name: "AllowanceError", type: "error" },
        { inputs: [], name: "AmountExceededBalanceError", type: "error" },
        { inputs: [], name: "EscrowInteractionPaused", type: "error" },
        { inputs: [], name: "InteractedTradeError", type: "error" },
        { inputs: [], name: "InvalidTradePramsError", type: "error" },
        {
            inputs: [{ internalType: "address", name: "", type: "address" }],
            name: "NotAParticipantError",
            type: "error",
        },
        { inputs: [], name: "NotEnoughFeeError", type: "error" },
        { inputs: [], name: "NotOwnerError", type: "error" },
        { inputs: [], name: "RequirementsNotMetError", type: "error" },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "bytes32",
                    name: "instanceId",
                    type: "bytes32",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "partyA",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "partyB",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "enum AssetType",
                    name: "from",
                    type: "uint8",
                },
                {
                    indexed: false,
                    internalType: "enum AssetType",
                    name: "to",
                    type: "uint8",
                },
            ],
            name: "Cancelled",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "bytes32",
                    name: "instanceId",
                    type: "bytes32",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "partyA",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "partyB",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "enum AssetType",
                    name: "from",
                    type: "uint8",
                },
                {
                    indexed: false,
                    internalType: "enum AssetType",
                    name: "to",
                    type: "uint8",
                },
            ],
            name: "Completed",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "bytes32",
                    name: "instanceId",
                    type: "bytes32",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "partyA",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "partyB",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "enum AssetType",
                    name: "from",
                    type: "uint8",
                },
                {
                    indexed: false,
                    internalType: "enum AssetType",
                    name: "to",
                    type: "uint8",
                },
            ],
            name: "Created",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "newFee",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "dateChanged",
                    type: "uint256",
                },
            ],
            name: "FeeChanged",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: "address",
                    name: "_payer",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "_amount",
                    type: "uint256",
                },
            ],
            name: "FeePaid",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "dateChanged",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "bool",
                    name: "state",
                    type: "bool",
                },
            ],
            name: "InteractionState",
            type: "event",
        },
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
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "bytes32",
                    name: "instanceId",
                    type: "bytes32",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "partyA",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "partyB",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "enum AssetType",
                    name: "from",
                    type: "uint8",
                },
                {
                    indexed: false,
                    internalType: "enum AssetType",
                    name: "to",
                    type: "uint8",
                },
            ],
            name: "Rejected",
            type: "event",
        },
        {
            inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
            name: "acceptTrade",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
            name: "cancelTrade",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [],
            name: "cancelledCount",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "completedCount",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "enum AssetType",
                    name: "_fromType",
                    type: "uint8",
                },
                {
                    internalType: "enum AssetType",
                    name: "_toType",
                    type: "uint8",
                },
                { internalType: "string", name: "_title", type: "string" },
                { internalType: "address", name: "_partyB", type: "address" },
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
                    name: "_fromToken",
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
                    name: "_toToken",
                    type: "tuple",
                },
            ],
            name: "createTrade",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "payable",
            type: "function",
        },
        {
            inputs: [],
            name: "feeInETH",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
            name: "getEscrowById",
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
                    internalType: "struct Instance",
                    name: "",
                    type: "tuple",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{ internalType: "address", name: "_user", type: "address" }],
            name: "getHistory",
            outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
            name: "getStatus",
            outputs: [{ internalType: "enum Status", name: "", type: "uint8" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "interactionPaused",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
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
            inputs: [],
            name: "pendingCount",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
            name: "rejectTrade",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [],
            name: "rejectedCount",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{ internalType: "uint256", name: "_newFee", type: "uint256" }],
            name: "setFee",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [],
            name: "toggleCreateAndAccept",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [],
            name: "tradeCount",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
            name: "transferOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [],
            name: "withdraw",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
            name: "withdrawAmount",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                { internalType: "address", name: "receiver", type: "address" },
                {
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                { internalType: "uint256", name: "tokenId", type: "uint256" },
                { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            name: "withdrawERC1155",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                { internalType: "address", name: "receiver", type: "address" },
                {
                    internalType: "address",
                    name: "tokenAddress",
                    type: "address",
                },
                { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            name: "withdrawERC20",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                { internalType: "address", name: "receiver", type: "address" },
                {
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "withdrawERC721",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        { stateMutability: "payable", type: "receive" },
    ],
};
