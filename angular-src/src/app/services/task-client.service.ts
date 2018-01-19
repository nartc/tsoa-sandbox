///<reference path="../../../node_modules/automapper-ts/dist/automapper.d.ts"/>
import {Injectable} from '@angular/core';
import {Configuration, ITaskResponse, ITaskVm, TaskService} from '../swagger-api';
import {Observable} from 'rxjs/Observable';
import {} from 'automapper-ts';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '../store/IAppState';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class TaskClientService {
  static CURRENT_TASKS_LOADING = 'CURRENT_TASKS_LOADING';
  static CURRENT_TASKS_LOADED = 'CURRENT_TASKS_LOADED';
  static CREATING_TASK = 'CREATING_TASK';
  static TASK_CREATED = 'TASK_CREATED';
  static EDITING_TASK = 'EDITING_TASK';
  static TASK_EDITED = 'TASK_EDITED';

  constructor(private taskApi: TaskService,
              private ngRedux: NgRedux<IAppState>) {
  }

  getTasksByUser(token: string): Observable<ITaskVm[]> {
    automapper.createMap('ITaskResponse[]', 'ITaskVm[]')
      .forSourceMember('user', (opts) => opts.ignore());
    this.currentTasksLoadingAction();
    this.taskApi.configuration = new Configuration({
      apiKeys: {
        Authorization: token
      }
    });
    return this.taskApi.getTasks()
      .filter(data => !!data)
      .map((response: ITaskResponse[]) => {
        const tasks: ITaskVm[] = automapper.map('ITaskResponse[]', 'ITaskVm[]', response);
        this.currentTasksLoadedAction(tasks);
        this.taskApi.configuration.apiKeys['Authorization'] = null;
        return tasks;
      }, (error: HttpErrorResponse) => {
        this.taskApi.configuration.apiKeys['Authorization'] = null;
        return error;
      });
  }

  private currentTasksLoadingAction() {
    this.ngRedux.dispatch({type: TaskClientService.CURRENT_TASKS_LOADING});
  }

  private currentTasksLoadedAction(tasks: ITaskVm[]) {
    this.ngRedux.dispatch({type: TaskClientService.CURRENT_TASKS_LOADED, payload: tasks});
  }
}
