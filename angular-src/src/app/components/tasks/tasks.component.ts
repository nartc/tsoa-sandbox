import {Component, OnInit} from '@angular/core';
import {Subscribe} from '../../utils/Subscribe';
import {Observable} from 'rxjs/Observable';
import {ITaskVm} from '../../swagger-api';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  @Subscribe(['taskState', 'currentUserTasks'])
  private currentUserTasks$: Observable<ITaskVm[]>;

  pageTitle: string;
  loading = true;
  tasks: ITaskVm[];

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    // Fetch Router Title
    this.pageTitle = this.activatedRoute.snapshot.data['pageTitle'];
    // Fetch Tasks
    this.currentUserTasks$
      .filter(data => !!data)
      .subscribe((tasks: ITaskVm[]) => {
        this.tasks = tasks;
        this.loading = false;
      });
  }

  onDetailClick(task: ITaskVm) {
    console.log(task);
  }

  onCompleteTaskHandler(task: ITaskVm) {
    console.log(task);
  }
}
