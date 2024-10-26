import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome6';
import React from 'react';
import {enableScreens} from 'react-native-screens';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import WalletStack from './WalletStack';
import SettingsStack from './SettingsStack';
import {globalData} from '../globalVariables';
import Colors from "../constants/Colors";

enableScreens();

const Tab = createBottomTabNavigator();

const noTabRoutes = [
    'LogIn',
    'SignUp',
    'BankAccount',
];

function isTabBarVisible(route) {
    const focusedRoute = getFocusedRouteNameFromRoute(route);
    const routeName = focusedRoute || globalData.initialRoute;
    return !noTabRoutes.some((route) => routeName.startsWith(route));
}

const TabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName={'Wallet'}
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarActiveTintColor: Colors.lightBlue,
                tabBarInactiveTintColor: '#ffffff',
                tabBarAllowFontScaling: false,
                tabBarHideOnKeyboard: true,
                tabBarVisible: false,
                hideTabBar: true,
                tabBarStyle: {
                    backgroundColor: '#000000',
                    borderTopWidth: 0,
                    display: isTabBarVisible(route) ? 'flex' : 'none',
                },
                headerTitleAlign: 'left',
            })}>
            <Tab.Screen
                name="WalletTab"
                component={WalletStack}
                options={{
                    tabBarLabel: 'Wallet',
                    tabBarTestID: 'wallet-tab',
                    tabBarIcon: ({color}) => <Icon light name="wallet" size={24} color={color} />,
                }}
            />
            <Tab.Screen
                name="SettingsTab"
                component={SettingsStack}
                options={{
                    tabBarLabel: 'Settings',
                    tabBarTestID: 'settings-tab',
                    tabBarIcon: ({color}) => <Icon name="gear" light color={color} size={24} />,
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
