import { TestBed } from '@angular/core/testing';

import { ViewTypePublicService } from './view-type-public.service';

describe('ViewTypePublicService', () => {
  let service: ViewTypePublicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewTypePublicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
