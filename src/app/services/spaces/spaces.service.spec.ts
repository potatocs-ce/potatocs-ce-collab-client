import { TestBed } from '@angular/core/testing';

import { SpacesService } from './spaces.service';

describe('SpacesService', () => {
  let service: SpacesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpacesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
