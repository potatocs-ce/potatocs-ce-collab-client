import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceAddStatusDialogComponent } from './space-add-status-dialog.component';

describe('SpaceAddStatusDialogComponent', () => {
  let component: SpaceAddStatusDialogComponent;
  let fixture: ComponentFixture<SpaceAddStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceAddStatusDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpaceAddStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
