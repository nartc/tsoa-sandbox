import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  atHome = true;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
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
  }

}
