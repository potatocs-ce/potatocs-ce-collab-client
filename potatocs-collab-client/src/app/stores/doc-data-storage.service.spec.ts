import { TestBed } from '@angular/core/testing';

import { DocDataStorageService } from './doc-data-storage.service';

describe('DocDataStorageService', () => {
  let service: DocDataStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocDataStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
