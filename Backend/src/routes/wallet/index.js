const express = require('express');
const User = require('../../models/user');
const authMiddleware = require('../../middleware/authMiddleware');
const {getBankBalances} = require('../banking/utils');
const {getBitcoinPriceInUSD, getAddressBalance, generateBlock} = require('./utils');

module.exports = (plaidClient, bitcoinClient) => {
    const router = express.Router();

    router.get('/bitcoin-price', async (req, res) => {
        try {
            const bitcoinPriceInUSD = await getBitcoinPriceInUSD();
            res.json({bitcoinPrice: bitcoinPriceInUSD});
        } catch (error) {
            res.status(500).json({error: 'Failed to fetch Bitcoin price'});
        }
    });

    router.post('/purchase-bitcoin', authMiddleware, async (req, res, next) => {
        const {amount, selectedBankAccountId} = req.body;
        const userId = req.userId;

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }

            const balanceResponse = await getBankBalances(plaidClient, req.body.plaidPublicToken);
            const selectedAccount = balanceResponse.data.accounts.find(
                (item) => item.account_id === selectedBankAccountId,
            );
            const availableBalance = selectedAccount.balances.available;
            const bitcoinAmount = parseFloat(amount);
            const bitcoinPriceInUSD = await getBitcoinPriceInUSD();
            const bitcoinAmountCost = bitcoinAmount * bitcoinPriceInUSD;
            if (availableBalance < bitcoinAmountCost) {
                return res.status(400).json({error: 'Insufficient funds in bank account'});
            }
            const transactionId = await bitcoinClient.sendToAddress(
                user.bitcoinAddress,
                bitcoinAmount,
            );

            await generateBlock(bitcoinClient);

            const bitcoinBalance = await getAddressBalance(bitcoinClient, user.bitcoinAddress);
            res.json({
                transactionId,
                bitcoinBalance,
                bitcoinAddress: user.bitcoinAddress,
            });
        } catch (err) {
            next(err);
        }
    });

    router.get('/fetch-user-and-balance', authMiddleware, async (req, res, next) => {
        const userId = req.userId;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }
            const bitcoinBalance = await getAddressBalance(bitcoinClient, user.bitcoinAddress);
            res.json({
                user: {name: user.name, email: user.email, bitcoinAddress: user.bitcoinAddress},
                bitcoinBalance,
            });
        } catch (err) {
            next(err);
        }
    });

    return router;
};
