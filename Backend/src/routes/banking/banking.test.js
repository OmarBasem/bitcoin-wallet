const request = require('supertest');
const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const banking = require('./index');
const {createLinkTokenArgs, getBankBalances} = require('./utils');
const errorHandlerMiddleware = require('../../middleware/errorHandlerMiddleware');

jest.mock('../../middleware/authMiddleware', () => jest.fn((req, res, next) => next()));
jest.mock('./utils', () => ({
    createLinkTokenArgs: jest.fn(),
    getBankBalances: jest.fn(),
}));

const mockPlaidClient = {
    linkTokenCreate: jest.fn(),
    itemPublicTokenExchange: jest.fn(),
    accountsBalanceGet: jest.fn(),
};

const app = express();
app.use(express.json());
app.use('/api/banking', banking(mockPlaidClient));
app.use(errorHandlerMiddleware);

describe('Plaid API Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /create-plaid-token', () => {
        it('should create a Plaid link token successfully', async () => {
            createLinkTokenArgs.mockReturnValue({mock: 'args'});
            mockPlaidClient.linkTokenCreate.mockResolvedValue({
                data: {link_token: 'test_link_token'},
            });

            const response = await request(app)
                .post('/api/banking/create-plaid-token')
                .send({platform: 'ios'});

            expect(authMiddleware).toHaveBeenCalled();
            expect(createLinkTokenArgs).toHaveBeenCalledWith(expect.any(Object));
            expect(mockPlaidClient.linkTokenCreate).toHaveBeenCalledWith({mock: 'args'});
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({linkToken: 'test_link_token'});
        });

        it('should handle errors in creating a Plaid link token', async () => {
            mockPlaidClient.linkTokenCreate.mockRejectedValue(new Error('Plaid error'));

            const response = await request(app)
                .post('/api/banking/create-plaid-token')
                .send({platform: 'ios'});

            expect(response.statusCode).toBe(500);
        });
    });

    describe('POST /get-link-token-update-mode', () => {
        it('should exchange a public token and create a Plaid link token in update mode', async () => {
            mockPlaidClient.itemPublicTokenExchange.mockResolvedValue({
                data: {access_token: 'test_access_token'},
            });
            createLinkTokenArgs.mockReturnValue({mock: 'args'});
            mockPlaidClient.linkTokenCreate.mockResolvedValue({
                data: {link_token: 'test_link_token'},
            });

            const response = await request(app)
                .post('/api/banking/get-link-token-update-mode')
                .send({plaidPublicToken: 'mock_plaid_token'});

            expect(mockPlaidClient.itemPublicTokenExchange).toHaveBeenCalledWith({
                public_token: 'mock_plaid_token',
            });
            expect(createLinkTokenArgs).toHaveBeenCalledWith(expect.any(Object));
            expect(mockPlaidClient.linkTokenCreate).toHaveBeenCalledWith({
                mock: 'args',
                access_token: 'test_access_token',
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({linkToken: 'test_link_token'});
        });

        it('should handle errors in updating a Plaid link token', async () => {
            mockPlaidClient.itemPublicTokenExchange.mockRejectedValue(new Error('Plaid error'));

            const response = await request(app)
                .post('/api/banking/get-link-token-update-mode')
                .send({plaidPublicToken: 'mock_plaid_token'});

            expect(response.statusCode).toBe(500);
        });
    });

    describe('POST /get-bank-balances', () => {
        it('should get bank balances successfully', async () => {
            getBankBalances.mockResolvedValue({
                data: {
                    accounts: [{account_id: 'account_1', balance: 100}],
                    item: {institution_id: 'institution_1'},
                },
            });

            const response = await request(app)
                .post('/api/banking/get-bank-balances')
                .send({plaidPublicToken: 'mock_plaid_token'});

            expect(getBankBalances).toHaveBeenCalledWith(mockPlaidClient, 'mock_plaid_token');
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                accounts: [{account_id: 'account_1', balance: 100}],
                institutionId: 'institution_1',
            });
        });

        it('should handle errors in getting bank balances', async () => {
            getBankBalances.mockRejectedValue(new Error('Plaid error'));

            const response = await request(app)
                .post('/api/banking/get-bank-balances')
                .send({plaidPublicToken: 'mock_plaid_token'});
            expect(response.statusCode).toBe(500);
        });
    });
});
