import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveMngmtComponent } from './leave-mngmt.component';

describe('LeaveMngmtComponent', () => {
  let component: LeaveMngmtComponent;
  let fixture: ComponentFixture<LeaveMngmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveMngmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveMngmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
