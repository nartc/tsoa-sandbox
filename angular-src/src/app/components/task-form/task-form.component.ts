import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BaseForm} from '../../utils/BaseForm';
import {TaskClientService} from '../../services/task-client.service';
import {INewTaskParams, ITaskVm} from '../../swagger-api';
import {AlertService} from '../../services/alert.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscribe} from '../../utils/Subscribe';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent extends BaseForm implements OnInit {
  @Subscribe(['authState', 'authToken'])
  private authToken$: Observable<string>;
  authToken: string;

  form: FormGroup;
  title: FormControl;
  content: FormControl;

  constructor(private formBuilder: FormBuilder,
              private taskService: TaskClientService,
              private alertService: AlertService,
              private router: Router) {
    super();
  }

  ngOnInit() {
    this.authToken$
      .filter(data => !!data)
      .subscribe((token: string) => {
        this.authToken = token;
      });

    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
    this.exposeControls();
  }

  submit() {
    const newTask: INewTaskParams = {
      title: this.title.value,
      content: this.content.value
    };

    this.taskService.createTask(this.authToken, newTask)
      .subscribe((task: ITaskVm) => {
        this.alertService.showSuccessGrowlMessage('Task created successfully', 'Successful');
        this.router.navigate(['/user/tasks']);
      }, (error: HttpErrorResponse) => {
        console.log(error);
      });
  }

}
