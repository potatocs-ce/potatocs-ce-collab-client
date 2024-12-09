import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSettingSpaceComponent } from './dialog-setting-space.component';

describe('DialogSettingSpaceComponent', () => {
  let component: DialogSettingSpaceComponent;
  let fixture: ComponentFixture<DialogSettingSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSettingSpaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSettingSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
