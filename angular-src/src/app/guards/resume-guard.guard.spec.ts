import { TestBed, async, inject } from '@angular/core/testing';

import { ResumeGuardGuard } from './resume-guard.guard';

describe('ResumeGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResumeGuardGuard]
    });
  });

  it('should ...', inject([ResumeGuardGuard], (guard: ResumeGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
