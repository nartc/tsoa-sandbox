import {ITaskVm} from '../swagger-api';

export interface ITaskState {
  readonly currentUserTasks: ITaskVm[];
  readonly createdTask: ITaskVm;
  readonly editingTask: ITaskVm;
}
