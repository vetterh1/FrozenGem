import * as ACTIONS from "../_constants/action-types";
import { userServices } from '../_services/userServices';
import { itemsActions } from './itemsActions';
import { notifierActions } from './notifierActions';
import { history } from '../misc/history';

export const userActions = {
    login,
    autologin,
    logout,
    register,
    setLanguage,
    setNavigationStyle,
};


function setLanguage(language) {
    return async dispatch => {

        userServices.setLanguage(language);
        dispatch({ type: ACTIONS.SET_LANGUAGE, language });
    };
}

function setNavigationStyle(navigationStyle) {
    return async dispatch => {

        userServices.setNavigationStyle(navigationStyle);
        dispatch({ type: ACTIONS.SET_NAVIGATION_STYLE, navigationStyle });
    };
}


function login(email, password) {
    return async dispatch => {
        dispatch({ type: ACTIONS.LOGIN_REQUEST });

        userServices.login(email, password)
            .then(
                user => {
                    // Add user info & items to redux store
                    dispatch({ type: ACTIONS.LOGIN_SUCCESS, user });

                    // Start fetching the items from the server
                    dispatch(itemsActions.fetchItems())
                                        
                    // Success message
                    dispatch(notifierActions.addIntlNotifier('login.success', 'success'));

                    // navigate to the home route
                    history.push('/');

                    return user.name;
                },
                error => {
                    dispatch({ type: ACTIONS.LOGIN_FAILURE, error: error.toString() });

                    // Error message
                    const unauthorized = error.response && error.response.status === 401;
                    const message = unauthorized ? 'login.unauthorized' : 'login.error';
                    dispatch(notifierActions.addIntlNotifier(message, 'error'));
                }
            );
    };
}


function autologin() {
    return dispatch => {
        userServices.autologin()
            .then(
                user => {
                    // Add user info & items to redux store
                    dispatch({ type: ACTIONS.LOGIN_SUCCESS, user });

                    // Start fetching the items from the server
                    dispatch(itemsActions.fetchItems())

                    // Success message
                    dispatch(notifierActions.addIntlNotifier('login.success', 'success'));

                    // navigate to the home route
                    history.push('/');

                    return user.name;
                },
                error => {
                    // No error message ==> autologin is silent!
                }
            );
    };
}

function logout() {
    userServices.logout();
    return { type: ACTIONS.LOGOUT };
}





//
// TODO Implement reducer + userServices.register() + check aserActions.register() (below)
//

function register(user) {
    return dispatch => {
        dispatch({ type: ACTIONS.REGISTER_REQUEST });

        userServices.register(user)
            .then(
                ({ user, items }) => {
                    // Add user info & items to redux store
                    dispatch({ type: ACTIONS.REGISTER_SUCCESS, user });
                    dispatch({ type: ACTIONS.FETCH_ITEMS_SUCCESS, items });

                    // history.push('/login');
                    // dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch({ type: ACTIONS.REGISTER_FAILURE, error: error.toString() });
                }
            );
    };
}
