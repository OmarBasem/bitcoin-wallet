async function getAddressBalance(bitcoinClient, address) {
    try {
        const unspentOutputs = await bitcoinClient.listUnspent(0, 999999999, [address]);
        return unspentOutputs.reduce((sum, output) => sum + output.amount, 0);
    } catch (error) {
        console.error('Error getting address balance:', error);
        throw new Error('Failed to get address balance');
    }
}

async function getBitcoinPriceInUSD() {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
        );
        if (!response.ok) {
            throw new Error('Coingecko network response was not ok');
        }
        const data = await response.json();
        return data.bitcoin.usd;
    } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        throw new Error('Failed to fetch Bitcoin price');
    }
}

async function generateBlock(bitcoinClient) {
    const newAddress = await bitcoinClient.getNewAddress();
    await bitcoinClient.generateToAddress(1, newAddress);
}

module.exports = {
    getAddressBalance,
    getBitcoinPriceInUSD,
    generateBlock,
};
