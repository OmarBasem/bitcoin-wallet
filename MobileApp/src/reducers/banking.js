import {banking, auth} from '../actions/actionTypes';

const initialState = {institutions: {}, selectedBankAccountId: null};

export default function (state = initialState, action) {
    switch (action.type) {
        case banking.INSTITUTION_LINKED:
            const institutionId = action.payload.metadata.institution.id;
            const selectedBankAccountId = action.payload.metadata.accounts[0].id;
            return {
                ...state,
                institutions: {...state.institutions, [institutionId]: action.payload},
                selectedBankAccountId,
            };

        case banking.UPDATE_ACCOUNTS:
            const institution = state.institutions[action.payload.institutionId];
            const parsedAccounts = action.payload.accounts.map((item) => {
                const {account_id, ...rest} = item;
                return {id: account_id, ...rest};
            });
            return {
                ...state,
                institutions: {
                    ...state.institutions,
                    [action.payload.institutionId]: {
                        ...institution,
                        metadata: {...institution.metadata, accounts: parsedAccounts},
                    },
                },
            };

        case banking.SELECT_BANK_ACCOUNT:
            return {...state, selectedBankAccountId: action.payload.accountId};

        case auth.RESET_STATE:
            return initialState;

        default:
            return state;
    }
}
