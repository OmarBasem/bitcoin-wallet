# Full Stack Custodial Wallet App

This project is a small Full Stack custodial wallet app for purchasing bitcoin through a regtest node.

The frontend is implemented using React and React Native, and the backend using Express.js and MongoDB.

This project is composed of 2 sub-projects:

- Backend server: implemented under `Backend` directory
- Frontend mobile apps: implemented under `MobileApp` directory

https://github.com/user-attachments/assets/ee5d78bf-e5f9-440f-a74c-65c648c76c14

## Project Setup

### Database Setup

- Create a Mongo database:
    - You can use [Mongo CLI](https://www.mongodb.com/resources/products/fundamentals/create-database) 
    - Or docker: `docker run --name mongodb -d -p 27017:27017 -v mongodbdata:/data/db mongo`
    - Or any other way you like

### Backend Setup

1. `git clone git@github.com:OmarBasem/bitcoin-wallet.git`
2. `cd bitcoin-wallet/Backend`
3. Install packages: `yarn`
4. In `.env.dev` update `IP` to your machine's IPv4 address. If you running on macOS you can get it using: `ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1`
5. Update `.env.dev` file with your credentials for Plaid and Bitcoin regtest node RPC
6. Start server: `npm run dev`

### Mobile Setup

In a new tab:

1. `cd ../MobileApp`
2. Install packages: `yarn`
3. Install ios pods: `cd ios && pod install && cd ..`
4. Run on iOS: `npx react-native run-ios`
5. Run on Android: `npx react-native run-android`


### Bitcoin regtest node setup

First, install and build [bitcoind](https://github.com/bitcoin/bitcoin/blob/master/doc/build-osx.md)

Then, run a regtest node:

1. Inside the bitcoin directory, start regtest server: `cd ./build/src && ./bitcoind -regtest`
2. In a new tab, create a test wallet: `./bitcoin-cli -regtest createwallet mywallet`
3. Get a new address: `./bitcoin-cli -regtest getnewaddress`
4. Mine some regtest btc: `./bitcoin-cli -regtest generatetoaddress 10 <address-from-previous-step>`
5. Check block count: `./bitcoin-cli -regtest getblockcount`


## Unit Tests

The backend server includes unit tests for the routes using Jest.
The mobile app includes unit tests for Redux actions using Jest.

- Backend tests: `yarn test` (inside `Backend` directory)
- Mobile tests: `yarn test` (inside `MobileApp` directory)

## License

Licensed under the [MIT License](https://opensource.org/licenses/MIT)
