import {ITaskState} from '../ITaskState';

const INITIAL_STATE = {
  currentUserTasks: [],
  creatingTask: {},
  editingTask: {}
} as ITaskState;

export function TaskReducer(state: ITaskState = INITIAL_STATE, action: any): ITaskState {
  switch (action.type) {
    default:
      return state;
  }
}
