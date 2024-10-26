const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const plaid = require('plaid');
const bitcoinCore = require('bitcoin-core');
const errorHandlerMiddleware = require('./middleware/errorHandlerMiddleware');

require('dotenv').config({path: '.env.dev'});

const app = express();
const IP = process.env.IP;
const PORT = process.env.PORT || 8000;

connectDB();

app.use(express.json({extended: false}));
app.use(bodyParser.json());

const plaidClient = new plaid.PlaidApi(
    new plaid.Configuration({
        basePath: plaid.PlaidEnvironments.sandbox,
        baseOptions: {
            headers: {
                'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
                'PLAID-SECRET': process.env.PLAID_SECRET,
            },
        },
    }),
);

const bitcoinClient = new bitcoinCore({
    network: 'regtest',
    username: process.env.RPC_USERNAME,
    password: process.env.RPC_PASSWORD,
    host: 'localhost',
    port: 18443,
});

if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
        next();
    });
}

app.use('/api/auth', require('./routes/auth')(bitcoinClient));
app.use('/api/banking', require('./routes/banking')(plaidClient));
app.use('/api/wallet', require('./routes/wallet')(plaidClient, bitcoinClient));
app.use(errorHandlerMiddleware);

app.listen(PORT, IP, () => console.log(`Server running on http://${IP}:${PORT}`));
