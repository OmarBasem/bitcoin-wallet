import {API_ENDPOINT} from '../../globalVariables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth, system, wallet} from '../actionTypes';
import {Alert} from 'react-native';
import {createFetchOptions, handleFailedApiRequest} from '../utils';

export function fetchBitcoinPrice() {
    return async function (dispatch) {
        const response = await fetch(`${API_ENDPOINT}/wallet/bitcoin-price`);
        if (!response.ok)
            return handleFailedApiRequest('Failed to fetch bitcoin price!', response, dispatch);
        const data = await response.json();
        const {bitcoinPrice} = data;
        dispatch({type: system.BITCOIN_PRICE, payload: {bitcoinPrice}});
    };
}

export function purchaseBitcoin({amount, selectedBankAccountId, onSuccess}) {
    return async function (dispatch) {
        dispatch({type: system.START_LOADING});
        const plaidPublicToken = await AsyncStorage.getItem('@WalletApp:plaidPublicToken');
        const options = await createFetchOptions('POST', true);
        options.body = JSON.stringify({plaidPublicToken, amount, selectedBankAccountId});
        const response = await fetch(`${API_ENDPOINT}/wallet/purchase-bitcoin`, options);
        dispatch({type: system.END_LOADING});
        if (!response.ok)
            return handleFailedApiRequest('Failed to purchase bitcoin!', response, dispatch);
        const data = await response.json();
        const {bitcoinAddress, bitcoinBalance} = data;
        dispatch({type: wallet.UPDATE_BITCOIN_BALANCE, payload: {bitcoinAddress, bitcoinBalance}});
        onSuccess();
        Alert.alert('Success', 'Bitcoin purchased successfully');
    };
}

export function fetchUserAndBalance() {
    return async function (dispatch) {
        const userId = await AsyncStorage.getItem('@WalletApp:userId');
        if (!userId) {
            return;
        }
        const options = await createFetchOptions('GET', true);
        const response = await fetch(`${API_ENDPOINT}/wallet/fetch-user-and-balance`, options);
        if (!response.ok)
            return handleFailedApiRequest('Failed to fetch user and balance!', response, dispatch);
        const data = await response.json();
        const {user, bitcoinBalance} = data;
        dispatch({type: auth.USER_LOADED, payload: {user}});
        dispatch({
            type: wallet.UPDATE_BITCOIN_BALANCE,
            payload: {bitcoinAddress: user.bitcoinAddress, bitcoinBalance},
        });
    };
}
