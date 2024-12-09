import { TestBed } from '@angular/core/testing';

import { WebcamDeviceService } from './webcam-device.service';

describe('WebcamDeviceService', () => {
  let service: WebcamDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebcamDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
