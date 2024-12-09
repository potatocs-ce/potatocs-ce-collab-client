import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesRequestsAddComponent } from './leaves-requests-add.component';

describe('LeavesRequestsAddComponent', () => {
  let component: LeavesRequestsAddComponent;
  let fixture: ComponentFixture<LeavesRequestsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavesRequestsAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeavesRequestsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
