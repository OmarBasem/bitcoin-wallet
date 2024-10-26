import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import TabNavigator from './navigators/TabNavigator';
import configureStore from './store';
import Loading from "./components/Loading";

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#fff',
    },
};

function App() {
    const {persistor, store} = configureStore();
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <NavigationContainer theme={MyTheme}>
                    <TabNavigator/>
                    <Loading/>
                </NavigationContainer>
            </PersistGate>
        </Provider>
    );
}

export default App;
