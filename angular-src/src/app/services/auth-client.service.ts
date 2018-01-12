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

  getCurrent(token: string): Observable<IUserResponse> {
    this.fetchingCurrentUserAction();
    this.authApi.configuration = new Configuration({
      apiKeys: {
        Authorization: token
      }
    });
    return this.authApi.getCurrentUser('body', true)
      .map((user: IUserResponse) => {
        this.fetchedCurrentUserAction();
        this.authApi.configuration.apiKeys['Authorization'] = null;
        return user;
      }, (error: HttpErrorResponse) => {
        this.authApi.configuration.apiKeys['Authorization'] = null;
        return error;
      });
  }

  private storeUserData(result: ILoginResponse, useSession: boolean = false) {
    this.savingUserDataAction();
    const user: IUserVm = {
      id: result.id,
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

  private fetchedCurrentUserAction() {
    this.ngRedux.dispatch({type: AuthClientService.CURRENT_USER_FETCHED});
  }

  loggingInAction() {
    this.ngRedux.dispatch({type: AuthClientService.LOGGING_IN});
  }
}
