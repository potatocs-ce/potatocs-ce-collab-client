import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSpaceMemberComponent } from './dialog-space-member.component';

describe('DialogSpaceMemberComponent', () => {
  let component: DialogSpaceMemberComponent;
  let fixture: ComponentFixture<DialogSpaceMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSpaceMemberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSpaceMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
