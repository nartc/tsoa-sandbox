import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscribe} from '../../../utils/Subscribe';
import {TaskClientService} from '../../../services/task-client.service';
import {AuthClientService} from '../../../services/auth-client.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/combineLatest';
import {LocalStorageService} from '../../../services/local-storage.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})
export class UserLayoutComponent implements OnInit {
  @Subscribe(['authState', 'authToken'])
  private authToken$: Observable<string>;
  authToken: string;

  constructor(private authService: AuthClientService,
              private taskService: TaskClientService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    // Fetch Data
    this.authToken$
      .filter(data => !!data)
      .mergeMap((token: string) => {
        return Observable.combineLatest(
          this.authService.getCurrent(token),
          this.taskService.getTasksByUser(token)
        );
      })
      .subscribe(() => {
      }, (error: HttpErrorResponse) => {
        console.log('Error', error);
      });
  }

}
