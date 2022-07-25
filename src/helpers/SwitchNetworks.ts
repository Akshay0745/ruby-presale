const switchRequest = () => {
    return window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }],
    });
};

const addChainRequest = () => {
    return window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
            {
                chainId: "0x1",
                chainName: "Rinkeby Test Network",
                rpcUrls: ["https://mainnet.infura.io/v3/"],
                blockExplorerUrls: ["https://etherscan.io"],
                nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                },
            },
        ],
    });
};

export const switchNetwork = async () => {
    if (window.ethereum) {
        try {
            await switchRequest();
        } catch (error: any) {
            if (error.code === 4902) {
                try {
                    await addChainRequest();
                    await switchRequest();
                } catch (addError) {
                    console.log(error);
                }
            }
            console.log(error);
        }
    }
};
