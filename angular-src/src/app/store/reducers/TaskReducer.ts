import {ITaskState} from '../ITaskState';
import {TaskClientService as TaskActions} from '../../services/task-client.service';

const INITIAL_STATE = {
  currentUserTasks: [],
  createdTask: {},
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
    case TaskActions.CREATING_TASK:
      return Object.assign({}, state, {});
    case TaskActions.TASK_CREATED:
      return Object.assign({}, state, {
        currentUserTasks: [...action.payload],
        createdTask: action.payload
      });
    default:
      return state;
  }
}
