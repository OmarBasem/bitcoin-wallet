import Keychain from 'react-native-keychain';
import DeviceInfo from 'react-native-device-info';
import {Alert} from 'react-native';
import {system} from './actionTypes';

const bundleId = DeviceInfo.getBundleId();

export async function createFetchOptions(method, requiresAuth) {
    const options = {
        method,
        headers: {'Content-Type': 'application/json'},
    };
    if (requiresAuth) {
        const {password: authToken} = await Keychain.getGenericPassword({
            service: `${bundleId}.auth_token`,
        });
        options.headers.Authorization = `Bearer ${authToken}`;
    }
    return options;
}

export async function handleFailedApiRequest(errorTitle, response, dispatch) {
    dispatch({type: system.END_LOADING});
    let errorMessage;
    try {
        const data = await response.json();
        errorMessage = data.error;
    } catch (e) {
        errorMessage = 'Unknown Error!';
    } finally {
        Alert.alert(errorTitle, errorMessage);
    }
}
