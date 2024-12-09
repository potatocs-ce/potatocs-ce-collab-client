import { TestBed } from '@angular/core/testing';

import { ManagersService } from './managers.service';

describe('ManagersService', () => {
  let service: ManagersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
