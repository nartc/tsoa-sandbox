import {IUserVm} from '../swagger-api';

export interface IAuthState {
  readonly isAuthenticated: boolean;
  readonly authToken: string;
  readonly currentUser: IUserVm;
}
