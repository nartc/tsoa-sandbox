import {Component, OnInit} from '@angular/core';
import {Subscribe} from '../../utils/Subscribe';
import {Observable} from 'rxjs/Observable';
import {ITaskVm, IUserVm} from '../../swagger-api';
import {ActivatedRoute} from '@angular/router';
import {AuthClientService} from '../../services/auth-client.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import {TaskClientService} from '../../services/task-client.service';
import 'rxjs/add/observable/combineLatest';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Subscribe(['authState', 'authToken'])
  private authToken$: Observable<string>;
  authToken: string;

  userId: string;
  userProfile: IUserVm;
  tasks: ITaskVm[];

  constructor(private activatedRoute: ActivatedRoute,
              private authService: AuthClientService,
              private taskService: TaskClientService) {
  }

  ngOnInit() {
    // Getting the ID
    this.userId = this.activatedRoute.snapshot.params['id'];

    // Fetch Data
    this.authToken$
      .filter(data => !!data)
      .mergeMap((token: string) => {
        return Observable.combineLatest(
          this.authService.getCurrent(token),
          this.taskService.getTasksByUserId(token)
        );
      })
      .subscribe(([user, tasks]: [IUserVm, ITaskVm[]]) => {
        this.userProfile = user;
        this.tasks = tasks;
        console.log('User Profile: ', this.userProfile);
        console.log('Tasks: ', this.tasks);
      }, (error: HttpErrorResponse) => {
        console.log('Error', error);
      });
  }
}
