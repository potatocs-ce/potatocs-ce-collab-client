import { TestBed } from '@angular/core/testing';

import { MemberDataStorageService } from './member-data-storage.service';

describe('MemberDataStorageService', () => {
  let service: MemberDataStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemberDataStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
