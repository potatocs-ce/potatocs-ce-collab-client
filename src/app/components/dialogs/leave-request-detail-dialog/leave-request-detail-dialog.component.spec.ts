import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestDetailDialogComponent } from './leave-request-detail-dialog.component';

describe('LeaveRequestDetailDialogComponent', () => {
  let component: LeaveRequestDetailDialogComponent;
  let fixture: ComponentFixture<LeaveRequestDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestDetailDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeaveRequestDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
