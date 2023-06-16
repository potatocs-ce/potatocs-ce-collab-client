import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingEmployeeComponent } from './pending-employee.component';

describe('PendingEmployeeComponent', () => {
  let component: PendingEmployeeComponent;
  let fixture: ComponentFixture<PendingEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
