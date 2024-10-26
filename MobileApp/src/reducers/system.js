import {system} from "../actions/actionTypes";

const initialState = {
    isLoading: false,
    bitcoinPrice: 0,
    selectedBankAccountId: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case system.START_LOADING:
            return {...state, isLoading: true};

        case system.END_LOADING:
            return {...state, isLoading: false};

        case system.BITCOIN_PRICE:
            return {...state, bitcoinPrice: action.payload.bitcoinPrice};

        default:
            return state;
    }
}
