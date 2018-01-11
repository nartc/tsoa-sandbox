import { TestBed, inject } from '@angular/core/testing';

import { LogSwUpdateService } from './log-sw-update.service';

describe('LogSwUpdateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogSwUpdateService]
    });
  });

  it('should be created', inject([LogSwUpdateService], (service: LogSwUpdateService) => {
    expect(service).toBeTruthy();
  }));
});
