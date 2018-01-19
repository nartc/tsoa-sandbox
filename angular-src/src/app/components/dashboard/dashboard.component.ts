import {Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/combineLatest';
import {Subscribe} from '../../utils/Subscribe';
import {Observable} from 'rxjs/Observable';
import {IUserVm} from '../../swagger-api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Subscribe(['authState', 'currentUser'])
  private currentUser$: Observable<IUserVm>;
  currentUser: IUserVm;

  constructor() {
  }

  ngOnInit() {
    // Fetch CurrentUser from Redux
    this.currentUser$
      .filter(data => !!data)
      .subscribe((user: IUserVm) => {
        this.currentUser = user;
      });
  }
}
