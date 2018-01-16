import {ITaskState} from '../ITaskState';
import {TaskClientService as TaskActions} from '../../services/task-client.service';

const INITIAL_STATE = {
  currentUserTasks: [],
  creatingTask: {},
  editingTask: {}
} as ITaskState;

export function TaskReducer(state: ITaskState = INITIAL_STATE, action: any): ITaskState {
  switch (action.type) {
    case TaskActions.CURRENT_TASKS_LOADING:
      return Object.assign({}, state, {});
    case TaskActions.CURRENT_TASKS_LOADED:
      return Object.assign({}, state, {
        currentUserTasks: action.payload
      });
    default:
      return state;
  }
}
