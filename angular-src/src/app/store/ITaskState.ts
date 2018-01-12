import {ITaskVm} from '../swagger-api';

export interface ITaskState {
  readonly currentUserTasks: ITaskVm[];
  readonly creatingTask: ITaskVm;
  readonly editingTask: ITaskVm;
}
