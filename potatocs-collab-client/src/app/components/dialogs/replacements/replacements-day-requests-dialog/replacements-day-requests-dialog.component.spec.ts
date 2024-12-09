import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementsDayRequestsDialogComponent } from './replacements-day-requests-dialog.component';

describe('ReplacementsDayRequestsDialogComponent', () => {
  let component: ReplacementsDayRequestsDialogComponent;
  let fixture: ComponentFixture<ReplacementsDayRequestsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplacementsDayRequestsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReplacementsDayRequestsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
