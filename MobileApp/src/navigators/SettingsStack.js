import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
    SettingsScreen,
} from '../screens';

const Stack = createNativeStackNavigator();

const SettingsStack = () => {
    return (
        <Stack.Navigator
            initialRouteName={'Settings'}
        >
            <Stack.Screen
                name={'Settings'}
                component={SettingsScreen}
            />
        </Stack.Navigator>
    );
};

export default SettingsStack;
