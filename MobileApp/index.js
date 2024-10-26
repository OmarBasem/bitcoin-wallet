/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {globalData} from "./src/globalVariables";

const isLoggedIn = async () => {
    const userId = await AsyncStorage.getItem('@WalletApp:userId');
    let initialRoute = 'LogIn';
    if (userId) {
        initialRoute = 'Wallet';
    }
    globalData.initialRoute = initialRoute;
};
isLoggedIn();

AppRegistry.registerComponent(appName, () => App);
