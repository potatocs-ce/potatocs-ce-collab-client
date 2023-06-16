import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdRequestDetailsComponent } from './rd-request-details.component';

describe('RdRequestDetailsComponent', () => {
  let component: RdRequestDetailsComponent;
  let fixture: ComponentFixture<RdRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdRequestDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RdRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
