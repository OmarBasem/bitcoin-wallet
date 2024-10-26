function createLinkTokenArgs(req) {
    const baseArgs = {
        user: {client_user_id: req.userId},
        client_name: 'WalletApp',
        products: ['auth'],
        country_codes: ['US'],
        language: 'en',
    };
    if (req.body.platform === 'ios') {
        baseArgs.redirect_uri = 'https://omarbasem.com/plaid/';
    } else if (req.body.platform === 'android') {
        baseArgs.android_package_name = 'com.omarbasem.walletapp';
    }
    return baseArgs;
}

async function getBankBalances(plaidClient, plaidPublicToken) {
    const tokenExchangeResponse = await plaidClient.itemPublicTokenExchange({
        public_token: plaidPublicToken,
    });
    return await plaidClient.accountsBalanceGet({
        access_token: tokenExchangeResponse.data.access_token,
    });
}

module.exports = {
    createLinkTokenArgs,
    getBankBalances,
};
