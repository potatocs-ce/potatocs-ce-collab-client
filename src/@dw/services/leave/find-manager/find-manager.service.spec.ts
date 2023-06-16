import { TestBed } from '@angular/core/testing';

import { FindManagerService } from './find-manager.service';

describe('FindManagerService', () => {
  let service: FindManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
