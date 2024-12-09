import { TestBed } from '@angular/core/testing';

import { SpaceListStorageService } from './space-list-storage.service';

describe('SpaceListStorageService', () => {
  let service: SpaceListStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaceListStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
