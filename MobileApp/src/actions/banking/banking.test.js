import {updateSelectedAccount} from './index';
import configureStore from '../../store';
import {waitFor} from '@testing-library/react-native';

describe('banking actions', () => {
    let store;
    process.env.TESTING = '1';
    beforeEach(() => {
        jest.clearAllMocks();
        const config = configureStore();
        store = config.store;
    });

    describe('updateSelectedAccount()', () => {
        it('updates the selected bank account for payment', async () => {
            const func = updateSelectedAccount({accountId: '123'});
            await waitFor(() => func(store.dispatch));
            expect(store.getState().banking.selectedBankAccountId).toBe('123');
        });
    });
});
