import {IAuthState} from '../IAuthState';
import {AuthClientService as AuthActions} from '../../services/auth-client.service';

const INITIAL_STATE = {
  isAuthenticated: false,
  authToken: '',
  currentUser: {}
} as IAuthState;

export function AuthReducer(state: IAuthState = INITIAL_STATE, action: any): IAuthState {
  switch (action.type) {
    case AuthActions.LOGGING_IN:
      return Object.assign({}, state, {});
    case AuthActions.LOGGING_IN_FAILED:
      return Object.assign({}, state, {});
    case AuthActions.LOGGED_IN_SUCCESSFULLY:
      return Object.assign({}, state, {
        isAuthenticated: true,
        authToken: action.payload.authToken
      });
    case AuthActions.USER_DATA_SAVING:
      return Object.assign({}, state, {});
    case AuthActions.USER_DATA_SAVED:
      return Object.assign({}, state, {
        currentUser: action.payload
      });
    case AuthActions.LOGGING_OUT:
      return Object.assign({}, state, {});
    case AuthActions.LOGGED_OUT:
      return Object.assign({}, state, INITIAL_STATE);
    case AuthActions.CURRENT_USER_FETCHING:
      return Object.assign({}, state, {});
    case AuthActions.CURRENT_USER_FETCHED:
      return Object.assign({}, state, {
        currentUser: action.payload
      });
    case AuthActions.REFRESH_CURRENT_USER:
      return Object.assign({}, state, {
        currentUser: action.payload.user,
        authToken: action.payload.token,
        isAuthenticated: true
      });
    default:
      return state;
  }
}
