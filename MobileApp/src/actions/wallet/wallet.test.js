import {fetchBitcoinPrice, fetchUserAndBalance, purchaseBitcoin} from './index';
import configureStore from '../../store';
import {waitFor} from '@testing-library/react-native';

describe('wallet actions', () => {
    const mockUser = {
        name: 'John Doe',
        email: 'john@test.com',
        id: '123',
        bitcoinAddress: 'abc',
    };
    let store;
    process.env.TESTING = '1';
    beforeEach(() => {
        jest.clearAllMocks();
        const config = configureStore();
        store = config.store;
    });

    describe('fetchBitcoinPrice()', () => {
        it('fetches and dispatches bitcoin price', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({bitcoinPrice: 50000}),
                }),
            );
            const func = fetchBitcoinPrice({accountId: '123'});
            await waitFor(() => func(store.dispatch));
            expect(store.getState().system.bitcoinPrice).toBe(50000);
        });
    });

    describe('purchaseBitcoin()', () => {
        it('makes a bitcoin purchase and updates the balance for the relevant address', async () => {
            const bitcoinAddress = 'bc123';
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({bitcoinAddress, bitcoinBalance: 0.1}),
                }),
            );
            const func = purchaseBitcoin({
                amount: 0.1,
                selectedBankAccountId: 'xyz',
                onSuccess: jest.fn(),
            });
            await waitFor(() => func(store.dispatch));
            expect(store.getState().wallet[bitcoinAddress]).toBe(0.1);
        });
    });

    describe('fetchUserAndBalance()', () => {
        it('fetches user and latest wallet balance', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({user: mockUser, bitcoinBalance: 0.3}),
                }),
            );
            const func = fetchUserAndBalance({
                amount: 0.1,
                selectedBankAccountId: 'xyz',
                onSuccess: jest.fn(),
            });
            await waitFor(() => func(store.dispatch));
            expect(store.getState().wallet[mockUser.bitcoinAddress]).toBe(0.3);
            expect(store.getState().auth.user).toStrictEqual(mockUser);
        });
    });
});
