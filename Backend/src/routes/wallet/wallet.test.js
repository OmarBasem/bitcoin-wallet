const request = require('supertest');
const express = require('express');
const User = require('../../models/user');
const {getBankBalances} = require('../banking/utils');
const {getBitcoinPriceInUSD, getAddressBalance} = require('./utils');
const bitcoinRoutes = require('./index');

jest.mock('../../models/user');
jest.mock('../../middleware/authMiddleware', () =>
    jest.fn((req, res, next) => {
        req.userId = 'mockUserId';
        next();
    }),
);
jest.mock('../banking/utils', () => ({
    getBankBalances: jest.fn(),
}));
jest.mock('./utils', () => ({
    getBitcoinPriceInUSD: jest.fn(),
    getAddressBalance: jest.fn(),
    generateBlock: jest.fn(),
}));

const mockPlaidClient = {};
const mockBitcoinClient = {
    sendToAddress: jest.fn(),
    listUnspent: jest.fn(),
};

const app = express();
app.use(express.json());
app.use('/api/wallet', bitcoinRoutes(mockPlaidClient, mockBitcoinClient));

describe('Bitcoin Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /bitcoin-price', () => {
        it('should return the current Bitcoin price in USD', async () => {
            getBitcoinPriceInUSD.mockResolvedValue(50000);

            const response = await request(app).get('/api/wallet/bitcoin-price');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({bitcoinPrice: 50000});
            expect(getBitcoinPriceInUSD).toHaveBeenCalled();
        });

        it('should handle errors when fetching Bitcoin price', async () => {
            getBitcoinPriceInUSD.mockRejectedValue(new Error('Failed to fetch Bitcoin price'));

            const response = await request(app).get('/api/wallet/bitcoin-price');

            expect(response.statusCode).toBe(500);
            expect(response.body).toEqual({error: 'Failed to fetch Bitcoin price'});
            expect(getBitcoinPriceInUSD).toHaveBeenCalled();
        });
    });

    describe('POST /purchase-bitcoin', () => {
        it('should allow a user to purchase Bitcoin if they have sufficient funds', async () => {
            const mockUser = {
                _id: 'mockUserId',
                bitcoinAddress: 'mockBitcoinAddress',
            };
            const mockBankAccounts = {
                data: {
                    accounts: [{account_id: 'account1', balances: {available: 60000}}],
                },
            };
            const mockTransactionId = 'mockTransactionId';
            const mockBitcoinBalance = 0.1;

            User.findById.mockResolvedValue(mockUser);
            getBankBalances.mockResolvedValue(mockBankAccounts);
            getBitcoinPriceInUSD.mockResolvedValue(50000);
            mockBitcoinClient.sendToAddress.mockResolvedValue(mockTransactionId);
            getAddressBalance.mockResolvedValue(mockBitcoinBalance);

            const response = await request(app).post('/api/wallet/purchase-bitcoin').send({
                amount: 1,
                selectedBankAccountId: 'account1',
                plaidPublicToken: 'mockPlaidToken',
            });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                transactionId: mockTransactionId,
                bitcoinBalance: mockBitcoinBalance,
                bitcoinAddress: 'mockBitcoinAddress',
            });
            expect(User.findById).toHaveBeenCalledWith('mockUserId');
            expect(getBankBalances).toHaveBeenCalledWith(mockPlaidClient, 'mockPlaidToken');
            expect(mockBitcoinClient.sendToAddress).toHaveBeenCalledWith('mockBitcoinAddress', 1);
            expect(getAddressBalance).toHaveBeenCalledWith(mockBitcoinClient, 'mockBitcoinAddress');
        });

        it('should return 404 if user is not found', async () => {
            User.findById.mockResolvedValue(null);

            const response = await request(app).post('/api/wallet/purchase-bitcoin').send({
                amount: 1,
                selectedBankAccountId: 'account1',
                plaidPublicToken: 'mockPlaidToken',
            });

            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({error: 'User not found'});
            expect(User.findById).toHaveBeenCalledWith('mockUserId');
        });

        it('should return 400 if there are insufficient funds', async () => {
            const mockUser = {
                _id: 'mockUserId',
                bitcoinAddress: 'mockBitcoinAddress',
            };
            const mockBankAccounts = {
                data: {
                    accounts: [{account_id: 'account1', balances: {available: 1000}}],
                },
            };

            User.findById.mockResolvedValue(mockUser);
            getBankBalances.mockResolvedValue(mockBankAccounts);
            getBitcoinPriceInUSD.mockResolvedValue(50000);

            const response = await request(app).post('/api/wallet/purchase-bitcoin').send({
                amount: 1,
                selectedBankAccountId: 'account1',
                plaidPublicToken: 'mockPlaidToken',
            });

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({error: 'Insufficient funds in bank account'});
            expect(getBankBalances).toHaveBeenCalledWith(mockPlaidClient, 'mockPlaidToken');
        });

        it('should handle errors during Bitcoin purchase', async () => {
            User.findById.mockRejectedValue(new Error('Failed to fetch user'));

            const response = await request(app).post('/api/wallet/purchase-bitcoin').send({
                amount: 1,
                selectedBankAccountId: 'account1',
                plaidPublicToken: 'mockPlaidToken',
            });
            expect(response.statusCode).toBe(500);
            expect(User.findById).toHaveBeenCalledWith('mockUserId');
        });
    });

    describe('GET /fetch-user-and-balance', () => {
        it('should return the user and their Bitcoin balance', async () => {
            const mockUser = {
                _id: 'mockUserId',
                name: 'John Doe',
                email: 'john@example.com',
                bitcoinAddress: 'mockBitcoinAddress',
            };
            const mockBitcoinBalance = 0.5;

            User.findById.mockResolvedValue(mockUser);
            getAddressBalance.mockResolvedValue(mockBitcoinBalance);

            const response = await request(app).get('/api/wallet/fetch-user-and-balance');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                user: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    bitcoinAddress: 'mockBitcoinAddress',
                },
                bitcoinBalance: mockBitcoinBalance,
            });
            expect(User.findById).toHaveBeenCalledWith('mockUserId');
            expect(getAddressBalance).toHaveBeenCalledWith(mockBitcoinClient, 'mockBitcoinAddress');
        });

        it('should return 404 if user is not found', async () => {
            User.findById.mockResolvedValue(null);

            const response = await request(app).get('/api/wallet/fetch-user-and-balance');

            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({error: 'User not found'});
            expect(User.findById).toHaveBeenCalledWith('mockUserId');
        });

        it('should handle errors when fetching user and balance', async () => {
            User.findById.mockRejectedValue(new Error('Failed to fetch user'));

            const response = await request(app).get('/api/wallet/fetch-user-and-balance');

            expect(response.statusCode).toBe(500);
            expect(User.findById).toHaveBeenCalledWith('mockUserId');
        });
    });
});
