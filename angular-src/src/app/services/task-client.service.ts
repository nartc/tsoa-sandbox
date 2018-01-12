import { Injectable } from '@angular/core';
import {TaskService} from '../swagger-api';

@Injectable()
export class TaskClientService {
  static CURRENT_TASKS_LOADING = 'CURRENT_TASKS_LOADING';
  static CURRENT_TASKS_LOADED = 'CURRENT_TASKS_LOADED';
  static CREATING_TASK = 'CREATING_TASK';
  static TASK_CREATED = 'TASK_CREATED';
  static EDITING_TASK = 'EDITING_TASK';
  static TASK_EDITED = 'TASK_EDITED';

  constructor(private taskApi: TaskService) { }
}
