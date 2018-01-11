import {Component} from '@angular/core';
import {LogSwUpdateService} from './services/log-sw-update.service';
import {OnInit} from '@angular/core/src/metadata/lifecycle_hooks';
import {UpdateAvailableEvent} from '@angular/service-worker/src/low_level';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Really Real Service Workers Updated';

  constructor(private logUpdateService: LogSwUpdateService) {}

  ngOnInit() {
    this.logUpdateService.registerUpdatesListener().subscribe((event: UpdateAvailableEvent) => {
      console.log(event.type);
      console.log(event.current);
      console.log(event.available);
    });
  }
}
