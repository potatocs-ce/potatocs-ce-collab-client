import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesRequestsComponent } from './leaves-requests.component';

describe('LeavesRequestsComponent', () => {
  let component: LeavesRequestsComponent;
  let fixture: ComponentFixture<LeavesRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavesRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeavesRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
