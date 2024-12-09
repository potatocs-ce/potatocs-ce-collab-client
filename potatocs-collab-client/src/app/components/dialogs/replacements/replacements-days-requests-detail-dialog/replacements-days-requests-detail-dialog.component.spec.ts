import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementsDaysRequestsDetailDialogComponent } from './replacements-days-requests-detail-dialog.component';

describe('ReplacementsDaysRequestsDetailDialogComponent', () => {
  let component: ReplacementsDaysRequestsDetailDialogComponent;
  let fixture: ComponentFixture<ReplacementsDaysRequestsDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplacementsDaysRequestsDetailDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReplacementsDaysRequestsDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
