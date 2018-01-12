import { TestBed, inject } from '@angular/core/testing';

import { AuthClientService } from './auth-client.service';

describe('AuthClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthClientService]
    });
  });

  it('should be created', inject([AuthClientService], (service: AuthClientService) => {
    expect(service).toBeTruthy();
  }));
});
