export function IPFStoHTTP(url) {
    // return url ? url?.replace("ipfs://", "https://ipfs.io/ipfs/") : "";

    const matcher = (url) => {
        if (url.startsWith("https://ipfs.io/ipfs/")) return url.replace("https://ipfs.io/ipfs/", "");
        if (url.startsWith("ipfs://")) return url.replace("ipfs://", "");
    };

    return url ? matcher(url) : url;
}
