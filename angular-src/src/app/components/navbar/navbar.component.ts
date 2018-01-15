import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {Subscribe} from '../../utils/Subscribe';
import {Observable} from 'rxjs/Observable';
import {IUserVm} from '../../swagger-api';
import 'rxjs/add/operator/filter';
import {AuthClientService} from '../../services/auth-client.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Subscribe(['authState', 'currentUser'])
  private currentUser$: Observable<IUserVm>;
  currentUser: IUserVm;

  atHome = true;
  _authService: AuthClientService;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthClientService) {
    this._authService = authService;
  }

  ngOnInit() {
    const firstChild: ActivatedRouteSnapshot = this.activatedRoute.snapshot.firstChild;
    if (firstChild.routeConfig.path !== '') {
      this.atHome = false;
    }
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        window.scrollTo(0, 0);
        const endpoint = event.url.split('?')[0];
        this.atHome = endpoint === '/';
      });

    // Get Current User
    this.currentUser$
      .filter(data => !!data)
      .subscribe((user: IUserVm) => {
        this.currentUser = user;
      });
  }

}
