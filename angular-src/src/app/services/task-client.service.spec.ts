import { TestBed, inject } from '@angular/core/testing';

import { TaskClientService } from './task-client.service';

describe('TaskClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskClientService]
    });
  });

  it('should be created', inject([TaskClientService], (service: TaskClientService) => {
    expect(service).toBeTruthy();
  }));
});
