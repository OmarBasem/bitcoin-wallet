jest.mock('react-native-keychain', () => ({
    setGenericPassword: jest.fn(() => Promise.resolve('mockPass')),
    getGenericPassword: jest.fn(() => Promise.resolve('mockPass')),
    resetGenericPassword: jest.fn(() => Promise.resolve(null)),
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve('mockItem')),
    getItem: jest.fn(() => Promise.resolve('mockItem')),
    removeItem: jest.fn(),
}));
jest.mock('react-native-device-info', () => ({
    getBundleId: jest.fn(() => 'com.walletapp'),
}));
jest.mock('react-native', () => ({
    Alert: {
        alert: jest.fn(),
    },
    Platform: {OS: 'ios'},
}));
jest.mock('redux-persist', () => {
    const real = jest.requireActual('redux-persist');
    return {
        ...real,
        persistReducer: jest.fn().mockImplementation((config, reducers) => reducers),
    };
});

jest.mock('react-native-plaid-link-sdk', () => ({
    create: jest.fn(),
    open: jest.fn(),
}));
