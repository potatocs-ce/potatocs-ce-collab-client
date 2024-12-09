import { TestBed } from '@angular/core/testing';

import { MeetingListStorageService } from './meeting-list-storage.service';

describe('MeetingListStorageService', () => {
  let service: MeetingListStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingListStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
