import {combineReducers} from 'redux';
import auth from './auth';
import system from './system';
import banking from './banking';
import wallet from './wallet';

export default combineReducers({
    auth,
    system,
    banking,
    wallet
});
