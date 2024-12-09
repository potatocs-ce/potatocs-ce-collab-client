import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectManagerDialogComponentComponent } from './connect-manager-dialog-component.component';

describe('ConnectManagerDialogComponentComponent', () => {
  let component: ConnectManagerDialogComponentComponent;
  let fixture: ComponentFixture<ConnectManagerDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectManagerDialogComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectManagerDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
