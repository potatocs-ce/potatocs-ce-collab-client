import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraDialogComponent } from './camera-dialog.component';

describe('CameraDialogComponent', () => {
  let component: CameraDialogComponent;
  let fixture: ComponentFixture<CameraDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CameraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
