import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagersConnectionComponent } from './managers-connection.component';

describe('ManagersConnectionComponent', () => {
  let component: ManagersConnectionComponent;
  let fixture: ComponentFixture<ManagersConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagersConnectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagersConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
