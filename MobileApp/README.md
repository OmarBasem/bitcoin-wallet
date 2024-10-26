# Full Stack Custodial Wallet App

This project is a small Full Stack custodial wallet app for purchasing bitcoin. 

The app consists of 2 main flows, a sign up flow, and a purchase flow.

The frontend is implemented using React Native, and the backend using Express.js and MongoDB.

This project is composed of 2 sub-projects:

- Backend server: implemented under `Backend` directory
- Frontend mobile apps: implemented under `MobileApp` directory

# Project Setup

## Database Setup

- Create a Mongo database:
    - You can use [Mongo CLI](https://www.mongodb.com/resources/products/fundamentals/create-database) 
    - Or docker: `docker run --name mongodb -d -p 27017:27017 -v mongodbdata:/data/db mongo`
    - Or any other way you like

## Backend Setup

1. `git clone git@github.com:ExodusMovementInterviews/Omar-Basem-2.git`
2. `cd Omar-Basem-2/Backend`
3. Install packages: `yarn`
4. In `.env.dev` update `IP` to your machine's IPv4 address. If you running on macOS you can get it using: `ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1`
5. Update `.env.dev` file with your credentials for Plaid and Bitcoin regtest node RPC
6. Start server: `npm run dev`

## Mobile Setup

In a new tab:

1. `cd ../MobileApp`
2. Install packages: `yarn`
3. Install ios pods: `cd ios && pod install && cd ..`
4. Run on iOS: `npx react-native run-ios`
5. Run on Android: `npx react-native run-android`

And finally, you need to setup a Bitcoin [regtest node](https://gist.github.com/olistic/2d5e303da5eb9ff4fa5f794b39171842).

# Unit Tests

The backend server includes unit tests for the routes using Jest.
The mobile app includes unit tests for Redux actions using Jest.

- Backend tests: `yarn test` (inside `Backend` directory)
- Mobile tests: `yarn test` (inside `MobileApp` directory)

# Flows Implemented

## Main requirements

- Sign up flow with all of its main requirements
- Purchase flow with all of its main requirements

## Bonus track

- Letting user purchase bitcoin according to what in their bank account's balance
- Showing user list of their accounts, their balances, and choosing which one to debit
- The user is automatically logged in after creating their account
