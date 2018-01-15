import {Component} from '@angular/core';
import {LogSwUpdateService} from './services/log-sw-update.service';
import {OnInit} from '@angular/core/src/metadata/lifecycle_hooks';
import {UpdateAvailableEvent} from '@angular/service-worker/src/low_level';
import {DevToolsExtension, NgRedux} from '@angular-redux/store';
import {IAppState} from './store/IAppState';
import {RootReducer} from './store/reducers/RootReducer';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {Message} from 'primeng/components/common/message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Really Real Service Workers Updated';
  growlMessages: Message[] = [];
  updateAvailable = false;
  updateBtnIcon = 'fa-refresh';
  constructor(private logUpdateService: LogSwUpdateService,
              private ngRedux: NgRedux<IAppState>,
              private devTools: DevToolsExtension,
              private _title: Title,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.logUpdateService.registerUpdatesListener().subscribe((event: UpdateAvailableEvent) => {
      this.updateAvailable = true;
    });

    const initialState = {} as IAppState;
    const enhancers = [];

    if (this.devTools.isEnabled()) {
      enhancers.push(this.devTools.enhancer());
    }

    this.ngRedux.configureStore(RootReducer, initialState, [], enhancers);
    this.registerTitleListener();
  }

  registerTitleListener() {
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter((route) => route.outlet === 'primary')
      .mergeMap((route) => route.data)
      .subscribe((event) => {
        this._title.setTitle(event['title']);
      });
  }

  onRefreshClick() {
    this.updateAvailable = false;
    window.location.reload(true);
  }

  onBtnHover() {
    this.updateBtnIcon = 'fa-spin fa-refresh';
  }

  onBtnOffHover() {
    this.updateBtnIcon = 'fa-refresh';
  }
}
