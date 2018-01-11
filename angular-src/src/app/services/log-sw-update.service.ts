import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {Observable} from 'rxjs/Observable';
import {UpdateAvailableEvent} from '@angular/service-worker/src/low_level';

@Injectable()
export class LogSwUpdateService {

  constructor(private updates: SwUpdate) {
    updates.checkForUpdate();
  }

  registerUpdatesListener(): Observable<UpdateAvailableEvent> {
    return this.updates.available;
  }
}
