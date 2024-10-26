import {wallet, auth} from '../actions/actionTypes';

const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case wallet.UPDATE_BITCOIN_BALANCE:
            return {...state, [action.payload.bitcoinAddress]: action.payload.bitcoinBalance};

        case auth.RESET_STATE:
            return initialState;

        default:
            return state;
    }
}
