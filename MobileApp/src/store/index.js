import {applyMiddleware, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reducers from '../reducers';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth', 'banking', 'wallet'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default function configureStore(preloadedState) {
    const store = createStore(persistedReducer, preloadedState, applyMiddleware(thunk));
    const persistor = persistStore(store);
    return {store, persistor};
}
