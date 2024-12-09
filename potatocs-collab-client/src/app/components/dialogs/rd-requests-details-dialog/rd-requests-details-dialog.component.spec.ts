import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdRequestsDetailsDialogComponent } from './rd-requests-details-dialog.component';

describe('RdRequestsDetailsDialogComponent', () => {
  let component: RdRequestsDetailsDialogComponent;
  let fixture: ComponentFixture<RdRequestsDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdRequestsDetailsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RdRequestsDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
