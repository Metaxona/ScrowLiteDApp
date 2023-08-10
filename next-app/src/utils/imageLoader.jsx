import { IPFStoHTTP } from "./ipfstohttps";

export const imageLoader = ({ src, width, quality }) => {
    if (typeof src === "string" && (src.startsWith("https://ipfs.io/ipfs/") || src.startsWith("ipfs://"))) {
        return `https://ipfs.io/ipfs/${IPFStoHTTP(src)}?w=${width}&q=${quality || 75}`;
    } else return src;
};
