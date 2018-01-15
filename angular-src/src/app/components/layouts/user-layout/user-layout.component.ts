import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthClientService} from '../../../services/auth-client.service';
import {IUserVm} from '../../../swagger-api';
import {Subscribe} from '../../../utils/Subscribe';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})
export class UserLayoutComponent implements OnInit {
  @Subscribe(['authState', 'authToken'])
  private authToken$: Observable<string>;

  userId: string;
  userProfile: IUserVm;

  constructor(private activatedRoute: ActivatedRoute,
              private authService: AuthClientService) {
  }

  ngOnInit() {
    // Getting the ID
    this.userId = this.activatedRoute.snapshot.params['id'];

    // Fetch Profile
    this.authToken$
      .filter(data => !!data)
      .mergeMap((token: string) => {
        return this.authService.getCurrent(token);
      })
      .subscribe((user: IUserVm) => {
        this.userProfile = user;
        console.log('User Profile: ', this.userProfile);
      });
  }

}
