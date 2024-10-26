const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const {createLinkTokenArgs, getBankBalances} = require('./utils');

module.exports = (plaidClient) => {
    const router = express.Router();

    router.post('/create-plaid-token', authMiddleware, async (req, res, next) => {
        try {
            const linkTokenArgs = createLinkTokenArgs(req);
            const response = await plaidClient.linkTokenCreate(linkTokenArgs);
            res.json({linkToken: response.data.link_token});
        } catch (err) {
            next(err);
        }
    });

    router.post('/get-link-token-update-mode', authMiddleware, async (req, res, next) => {
        try {
            const tokenExchangeResponse = await plaidClient.itemPublicTokenExchange({
                public_token: req.body.plaidPublicToken,
            });
            const linkTokenArgs = createLinkTokenArgs(req);
            linkTokenArgs.access_token = tokenExchangeResponse.data.access_token;
            const linkTokenResponse = await plaidClient.linkTokenCreate(linkTokenArgs);
            res.json({linkToken: linkTokenResponse.data.link_token});
        } catch (err) {
            next(err);
        }
    });

    router.post('/get-bank-balances', authMiddleware, async (req, res, next) => {
        try {
            const balanceResponse = await getBankBalances(plaidClient, req.body.plaidPublicToken);
            res.json({
                accounts: balanceResponse.data.accounts,
                institutionId: balanceResponse.data.item.institution_id,
            });
        } catch (err) {
            next(err);
        }
    });

    return router;
};
