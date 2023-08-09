export default function shortenAddress(address) {
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
}
