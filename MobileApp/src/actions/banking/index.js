import {API_ENDPOINT, globalData} from '../../globalVariables';
import {create, open} from 'react-native-plaid-link-sdk';
import {banking, system} from '../actionTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Platform} from 'react-native';
import {createFetchOptions, handleFailedApiRequest} from '../utils';

async function bankLinkedSuccessfully({dispatch, bankAccountsData, onSuccess}) {
    dispatch({type: system.END_LOADING});
    dispatch({type: banking.INSTITUTION_LINKED, payload: bankAccountsData});
    await AsyncStorage.setItem('@WalletApp:plaidPublicToken', bankAccountsData.publicToken);
    globalData.initialRoute = 'Wallet';
    onSuccess();
}

export function linkBankAccount({onSuccess}) {
    return async function (dispatch) {
        dispatch({type: system.START_LOADING});
        const options = await createFetchOptions('POST', true);
        options.body = JSON.stringify({platform: Platform.OS});
        const response = await fetch(`${API_ENDPOINT}/banking/create-plaid-token`, options);
        if (!response.ok)
            return handleFailedApiRequest('Failed to create Plaid token!', response, dispatch);
        const data = await response.json();
        create({token: data.linkToken});
        const openProps = {
            onSuccess: async (bankAccountsData) => {
                bankLinkedSuccessfully({dispatch, bankAccountsData, onSuccess});
            },
            onExit: (linkExit) => {
                dispatch({type: system.END_LOADING});
                Alert.alert('Bank linking not completed!', linkExit.metadata.status);
            },
        };
        open(openProps);
    };
}

async function requestBalancesFromServer({dispatch, bankAccountsData}) {
    const options = await createFetchOptions('POST', true);
    await AsyncStorage.setItem('@WalletApp:plaidPublicToken', bankAccountsData.publicToken);
    options.body = JSON.stringify({plaidPublicToken: bankAccountsData.publicToken});
    const response = await fetch(`${API_ENDPOINT}/banking/get-bank-balances`, options);
    if (!response.ok)
        return handleFailedApiRequest('Failed to get bank balances!', response, dispatch);
    const data = await response.json();
    const {accounts, institutionId} = data;
    dispatch({type: banking.UPDATE_ACCOUNTS, payload: {accounts, institutionId}});
    dispatch({type: system.END_LOADING});
}

export function fetchBankBalances() {
    return async function (dispatch) {
        dispatch({type: system.START_LOADING});
        const plaidPublicToken = await AsyncStorage.getItem('@WalletApp:plaidPublicToken');
        const options = await createFetchOptions('POST', true);
        options.body = JSON.stringify({plaidPublicToken});
        const response = await fetch(`${API_ENDPOINT}/banking/get-link-token-update-mode`, options);
        if (!response.ok)
            return handleFailedApiRequest(
                'Failed to get Plaid token in update mode!',
                response,
                dispatch,
            );
        const data = await response.json();
        create({token: data.linkToken});
        const openProps = {
            onSuccess: async (bankAccountsData) => {
                requestBalancesFromServer({dispatch, bankAccountsData});
            },
            onExit: (linkExit) => {
                dispatch({type: system.END_LOADING});
                Alert.alert('Bank balances linking not completed!', linkExit.metadata.status);
            },
        };
        open(openProps);
    };
}

export function updateSelectedAccount({accountId}) {
    return function (dispatch) {
        dispatch({type: banking.SELECT_BANK_ACCOUNT, payload: {accountId}});
    };
}
