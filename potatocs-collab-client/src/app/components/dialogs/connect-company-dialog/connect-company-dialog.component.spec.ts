import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectCompanyDialogComponent } from './connect-company-dialog.component';

describe('ConnectCompanyDialogComponent', () => {
  let component: ConnectCompanyDialogComponent;
  let fixture: ComponentFixture<ConnectCompanyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectCompanyDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectCompanyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
