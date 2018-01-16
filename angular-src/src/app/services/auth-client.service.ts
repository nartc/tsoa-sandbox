import {Injectable} from '@angular/core';
import {
  AuthService, Configuration, ILoginParams, ILoginResponse, INewUserParams, IUserResponse,
  IUserVm
} from '../swagger-api';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '../store/IAppState';
import {Observable} from 'rxjs/Observable';
import {LocalStorageService} from './local-storage.service';
import {HttpErrorResponse} from '@angular/common/http';
import {tokenNotExpired} from 'angular2-jwt';
import {isEmpty} from 'lodash';

@Injectable()
export class AuthClientService {
  static LOGGING_IN = 'LOGGING_IN';
  static LOGGED_IN_SUCCESSFULLY = 'LOGGED_IN_SUCCESSFULLY';
  static LOGGING_IN_FAILED = 'LOGGING_IN_FAILED';
  static LOGGING_OUT = 'LOGGING_OUT';
  static LOGGED_OUT = 'LOGGED_OUT';
  static USER_DATA_SAVING = 'USER_DATA_SAVING';
  static USER_DATA_SAVED = 'USER_DATA_SAVED';
  static CURRENT_USER_FETCHING = 'CURRENT_USER_FETCHING';
  static CURRENT_USER_FETCHED = 'CURRENT_USER_FETCHED';
  static REFRESH_CURRENT_USER = 'REFRESH_CURRENT_USER';
  static CURRENT_USER_UPDATING = 'CURRENT_USER_UPDATING';
  static CURRENT_USER_UPDATED = 'CURRENT_USER_UPDATED';

  constructor(private authApi: AuthService,
              private ngRedux: NgRedux<IAppState>,
              private localStorageService: LocalStorageService) {
  }

  register(registerParams: INewUserParams): Observable<IUserResponse> {
    return this.authApi.registerUser(registerParams, 'body', true)
      .map((result: IUserResponse) => {
        return result;
      }, (error: HttpErrorResponse) => {
        return error;
      });
  }

  loginUser(loginParams: ILoginParams, useSession: boolean): Observable<ILoginResponse> {
    this.loggingInAction();
    return this.authApi.login(loginParams)
      .map((result: ILoginResponse) => {
        this.loginSuccessfulAction(result);
        this.storeUserData(result, useSession);
        return result;
      }, (error: HttpErrorResponse) => {
        this.loginFailedAction();
        return error;
      });
  }

  getCurrent(token: string, refresh: boolean = false): Observable<IUserResponse> {
    this.fetchingCurrentUserAction();
    this.authApi.configuration = new Configuration({
      apiKeys: {
        Authorization: token
      }
    });
    return this.authApi.getCurrentUser('body', true)
      .map((user: IUserResponse) => {
        const userVm: IUserVm = {
          _id: user._id,
          username: user.username,
          createdOn: user.createdOn,
          updatedOn: user.updatedOn,
          email: user.email,
          role: user.role,
          lastVisited: user.lastVisited,
          profile: user.profile
        };
        refresh ? this.refreshCurrentUserAction(userVm, token) : this.fetchedCurrentUserAction(userVm);
        this.authApi.configuration.apiKeys['Authorization'] = null;
        return user;
      }, (error: HttpErrorResponse) => {
        this.authApi.configuration.apiKeys['Authorization'] = null;
        return error;
      });
  }

  refreshLoginResult(): void {
    const token = this.localStorageService.getObject('token');
    if (token && !isEmpty(token)) {
      this.getCurrent(token, true).subscribe();
    }
  }

  isLoggedIn(): boolean {
    return tokenNotExpired('token');
  }

  private storeUserData(result: ILoginResponse, useSession: boolean = false) {
    this.savingUserDataAction();
    const user: IUserVm = {
      _id: result._id,
      username: result.username,
      email: result.email,
      profile: result.profile,
      createdOn: result.createdOn,
      updatedOn: result.updatedOn,
      role: result.role,
      lastVisited: result.lastVisited
    };

    if (useSession) {
      this.localStorageService.useSessionStorage();
    } else {
      this.localStorageService.useLocalStorage();
    }

    this.localStorageService.setObject('current', user);
    this.localStorageService.setObject('token', result.authToken);
    this.savedUserDataAction(user);
  }

  logout() {
    this.loggingOutAction();
    this.localStorageService.clear();
    this.loggedOutAction();
  }

  private loginSuccessfulAction(result: ILoginResponse) {
    this.ngRedux.dispatch({type: AuthClientService.LOGGED_IN_SUCCESSFULLY, payload: result});
  }

  private loginFailedAction() {
    this.ngRedux.dispatch({type: AuthClientService.LOGGING_IN_FAILED});
  }

  private savingUserDataAction() {
    this.ngRedux.dispatch({type: AuthClientService.USER_DATA_SAVING});
  }

  private savedUserDataAction(user: IUserVm) {
    this.ngRedux.dispatch({type: AuthClientService.USER_DATA_SAVED, payload: user});
  }

  private loggingOutAction() {
    this.ngRedux.dispatch({type: AuthClientService.LOGGING_OUT});
  }

  private loggedOutAction() {
    this.ngRedux.dispatch({type: AuthClientService.LOGGED_OUT});
  }

  private fetchingCurrentUserAction() {
    this.ngRedux.dispatch({type: AuthClientService.CURRENT_USER_FETCHING});
  }

  private fetchedCurrentUserAction(user: IUserVm) {
    this.ngRedux.dispatch({type: AuthClientService.CURRENT_USER_FETCHED, payload: user});
  }

  private refreshCurrentUserAction(user: IUserVm, token: string) {
    this.ngRedux.dispatch({type: AuthClientService.REFRESH_CURRENT_USER, payload: {user, token}});
  }

  loggingInAction() {
    this.ngRedux.dispatch({type: AuthClientService.LOGGING_IN});
  }
}
