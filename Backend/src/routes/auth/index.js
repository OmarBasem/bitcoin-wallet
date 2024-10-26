const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const {generateJwtToken, createUser} = require('./utils');
const authMiddleware = require('../../middleware/authMiddleware');
const {getAddressBalance} = require('../wallet/utils');

module.exports = (bitcoinClient) => {
    const router = express.Router();

    router.post('/signup', async (req, res, next) => {
        const {name, password} = req.body;
        const email = req.body.email.toLowerCase();
        try {
            const existingUser = await User.findOne({email});
            if (existingUser) {
                return res.status(400).json({error: 'User already exists!'});
            }
            const user = await createUser(name, email, password, bitcoinClient);
            const token = await generateJwtToken(user.id);
            res.json({token, userId: user.id, bitcoinAddress: user.bitcoinAddress});
        } catch (err) {
            next(err);
        }
    });

    router.post('/login', async (req, res, next) => {
        const {password} = req.body;
        const email = req.body.email.toLowerCase();
        try {
            let user = await User.findOne({email});
            if (!user) {
                return res.status(400).json({error: 'User does not exist!'});
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({error: 'Incorrect password!'});
            }

            const token = await generateJwtToken(user.id);
            res.json({
                token,
                userId: user.id,
                bitcoinAddress: user.bitcoinAddress,
                name: user.name,
            });
        } catch (err) {
            next(err);
        }
    });

    return router;
};
