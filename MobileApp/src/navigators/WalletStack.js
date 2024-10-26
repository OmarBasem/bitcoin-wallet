import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
    LogInScreen, WalletScreen, SignUpScreen, BankAccountScreen, PurchaseScreen
} from '../screens';
import {globalData} from '../globalVariables';

const Stack = createNativeStackNavigator();

const WalletStack = () => {
    return (
        <Stack.Navigator initialRouteName={globalData.initialRoute}>
            <Stack.Screen
                name="LogIn"
                component={LogInScreen}
                options={{title: 'Log In'}}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{title: 'Sign Up'}}
            />
            <Stack.Screen
                name="BankAccount"
                component={BankAccountScreen}
                options={{title: 'Bank Account'}}
            />
            <Stack.Screen
                name="Wallet"
                component={WalletScreen}
            />
            <Stack.Screen
                name="Purchase"
                component={PurchaseScreen}
            />
        </Stack.Navigator>
    );
};

export default WalletStack;
