import { TestBed } from '@angular/core/testing';

import { ScrumboardStorageService } from './scrumboard-storage.service';

describe('ScrumboardStorageService', () => {
  let service: ScrumboardStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrumboardStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
