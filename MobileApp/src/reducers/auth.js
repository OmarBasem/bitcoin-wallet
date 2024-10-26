import {auth} from '../actions/actionTypes';

const initialState = {
    user: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case auth.USER_LOADED:
            return {...state, user: action.payload.user};

        case auth.RESET_STATE:
            return initialState;

        default:
            return state;
    }
}
