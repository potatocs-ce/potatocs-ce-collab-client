import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbDialogComponent } from './wb-dialog.component';

describe('WbDialogComponent', () => {
  let component: WbDialogComponent;
  let fixture: ComponentFixture<WbDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WbDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WbDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
