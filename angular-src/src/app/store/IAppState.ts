import {IAuthState} from './IAuthState';
import {ITaskState} from './ITaskState';

export interface IAppState {
  authState: IAuthState,
  taskState: ITaskState
}
