import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementLeaveRequestComponent } from './replacement-leave-request.component';

describe('ReplacementLeaveRequestComponent', () => {
  let component: ReplacementLeaveRequestComponent;
  let fixture: ComponentFixture<ReplacementLeaveRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplacementLeaveRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacementLeaveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
