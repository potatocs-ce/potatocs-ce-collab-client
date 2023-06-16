import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestLeaveListComponent } from './request-leave-list.component';

describe('RequestLeaveListComponent', () => {
  let component: RequestLeaveListComponent;
  let fixture: ComponentFixture<RequestLeaveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestLeaveListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestLeaveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
