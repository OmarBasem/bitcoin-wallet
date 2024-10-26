import {logIn, signUp, logOut} from './index';
import configureStore from '../../store';
import {waitFor} from '@testing-library/react-native';

describe('auth actions', () => {
    const mockUser = {
        name: 'John Doe',
        email: 'john@test.com',
        id: '123',
        bitcoinAddress: 'abc',
    };
    const token = 'mockToken';
    let store;
    process.env.TESTING = '1';
    beforeEach(() => {
        jest.clearAllMocks();
        const config = configureStore();
        store = config.store;
    });

    describe('signUp()', () => {
        it('dispatches user on successful signUp', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            token,
                            userId: mockUser.id,
                            bitcoinAddress: mockUser.bitcoinAddress,
                        }),
                }),
            );
            const func = signUp({
                name: 'John Doe',
                email: 'john@test.com',
                password: '123456',
                onSuccess: jest.fn(),
            });
            await waitFor(() => func(store.dispatch));
            expect(store.getState().auth.user).toStrictEqual(mockUser);
        });
        it('does not dispatch user on failed signUp and ends loading', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                    json: () => Promise.resolve({error: 'mockError'}),
                }),
            );
            const func = signUp({
                name: 'John Doe',
                email: 'john@test.com',
                password: '123456',
                onSuccess: jest.fn(),
            });
            await waitFor(() => func(store.dispatch));
            expect(store.getState().auth.user).toBeNull();
            expect(store.getState().system.loading).toBeFalsy();
        });
    });

    describe('logIn()', () => {
        it('dispatches user on successful logIn', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            token,
                            userId: mockUser.id,
                            bitcoinAddress: mockUser.bitcoinAddress,
                            name: mockUser.name,
                        }),
                }),
            );
            const func = logIn({
                email: 'john@test.com',
                password: '123456',
                onSuccess: jest.fn(),
            });
            await waitFor(() => func(store.dispatch));
            expect(store.getState().auth.user).toStrictEqual(mockUser);
        });
        it('does not dispatch user on failed logIn and ends loading', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                    json: () => Promise.resolve({error: 'mockError'}),
                }),
            );
            const func = logIn({
                email: 'john@test.com',
                password: '123456',
                onSuccess: jest.fn(),
            });
            await waitFor(() => func(store.dispatch));
            expect(store.getState().auth.user).toBeNull();
            expect(store.getState().system.loading).toBeFalsy();
        });
    });

    describe('logOut()', () => {
        it('resets user state', async () => {
            const config = configureStore({auth: {user: mockUser}});
            store = config.store;
            const func = logOut();
            await waitFor(() => func(store.dispatch));
            expect(store.getState().auth.user).toBeNull();
        });
    });
});
