import {API_ENDPOINT, globalData} from '../../globalVariables';
import {system, wallet} from '../actionTypes';
import * as Keychain from 'react-native-keychain';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../actionTypes';
import {createFetchOptions, handleFailedApiRequest} from '../utils';
import {Alert} from 'react-native';

const bundleId = DeviceInfo.getBundleId();

async function handleSuccessfulAuthentication({token, user, onSuccess, dispatch}) {
    try {
        await Keychain.setGenericPassword('AuthToken', token, {
            service: `${bundleId}.auth_token`,
        });
        await AsyncStorage.setItem('@WalletApp:userId', user.id);
        dispatch({type: auth.USER_LOADED, payload: {user}});
        onSuccess();
    } catch (error) {
        Alert.alert('Error!', `Failed to store user credentials: ${error.toString()}`);
    } finally {
        dispatch({type: system.END_LOADING});
    }
}

export function signUp({name, email, password, onSuccess}) {
    return async function (dispatch) {
        dispatch({type: system.START_LOADING});
        const options = await createFetchOptions('POST');
        options.body = JSON.stringify({name, email, password});
        const response = await fetch(`${API_ENDPOINT}/auth/signup`, options);
        if (!response.ok) return handleFailedApiRequest('Sign up failed!', response, dispatch);
        const data = await response.json();
        const {token, userId, bitcoinAddress} = data;
        const user = {name, email, id: userId, bitcoinAddress};
        await handleSuccessfulAuthentication({token, user, onSuccess, dispatch});
    };
}

export function logIn({email, password, onSuccess}) {
    return async function (dispatch) {
        dispatch({type: system.START_LOADING});
        const options = await createFetchOptions('POST');
        options.body = JSON.stringify({email, password});
        const response = await fetch(`${API_ENDPOINT}/auth/login`, options);
        if (!response.ok) return handleFailedApiRequest('Log up failed!', response, dispatch);
        const data = await response.json();
        const {token, userId, bitcoinAddress, name} = data;
        const user = {name, email, id: userId, bitcoinAddress};
        await handleSuccessfulAuthentication({token, user, onSuccess, dispatch});
    };
}

export function logOut() {
    return async function (dispatch) {
        dispatch({type: auth.RESET_STATE});
        Keychain.resetGenericPassword({service: `${bundleId}.auth_token`});
        AsyncStorage.removeItem('@WalletApp:userId');
        AsyncStorage.removeItem('@WalletApp:plaidPublicToken');
    };
}
