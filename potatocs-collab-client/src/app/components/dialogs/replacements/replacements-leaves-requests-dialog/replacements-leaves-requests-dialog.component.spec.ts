import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementsLeavesRequestsDialogComponent } from './replacements-leaves-requests-dialog.component';

describe('ReplacementsLeavesRequestsDialogComponent', () => {
  let component: ReplacementsLeavesRequestsDialogComponent;
  let fixture: ComponentFixture<ReplacementsLeavesRequestsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplacementsLeavesRequestsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReplacementsLeavesRequestsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
